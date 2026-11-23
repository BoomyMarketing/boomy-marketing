import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { SharedStore } from '../lib/assistant/shared-store.mjs';
import { reserve, settle, throttle, voiceReserve } from '../lib/assistant/state.mjs';

const migration = await readFile(new URL('../lib/assistant/store.sql', import.meta.url), 'utf8');
const limits = { day: 8_000_000, month: 25_000_000 };

async function database(t) {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(migration);
  let now = Date.UTC(2026, 10, 30, 23, 59, 59);
  let conflicts = 0;
  const worker = () => new SharedStore(async (query, params) => {
    const { rows } = await db.query(query, params);
    if (query.includes('RETURNING version') && !rows.length) conflicts++;
    if (rows[0]?.now_ms) rows[0].now_ms = String(now);
    return rows;
  });
  return { db, worker, moveClock: ms => { now = ms; }, conflicts: () => conflicts };
}

test('independent clients share one atomic USD 8 daily ledger across a UTC month boundary', async t => {
  const { worker, conflicts } = await database(t);
  const first = worker();
  const second = worker();
  // The injected server timestamp is November 30, even when an application clock disagrees.
  const results = await Promise.allSettled([first, second].map((client, i) =>
    reserve(client, 'voice-' + i, voiceReserve, limits, Date.UTC(2030, 0, 1), 7_380_000)));
  const winner = results.findIndex(r => r.status === 'fulfilled');
  assert.ok(winner >= 0);
  const loser = results[1 - winner];
  assert.equal(loser.reason.status, 429);
  assert.ok(conflicts() > 0);
  const cold = worker();
  const keys = ['2026-11', '2026-11-30', '2026-12', '2026-12-01'];
  assert.deepEqual((await cold.read('spend')).totals, Object.fromEntries(keys.map(k => [k, voiceReserve])));
  await Promise.all([first, cold].map(client => settle(client, 'voice-' + winner, 300_000)));
  assert.deepEqual((await second.read('spend')).totals, Object.fromEntries(keys.map(k => [k, 300_000])));
  await assert.rejects(reserve(cold, 'voice-' + winner, voiceReserve, limits, 0, 7_380_000), { status: 409 });
});

test('the USD 25 monthly cap is shared across days and worker instances', async t => {
  const { worker, moveClock } = await database(t);
  const clients = [worker(), worker()];
  for (const day of [1, 2, 3]) {
    moveClock(Date.UTC(2026, 11, day, 12));
    await reserve(clients[day % 2], 'day-' + day, 8_000_000, limits, 0, 1_000);
  }
  moveClock(Date.UTC(2026, 11, 4, 12));
  const results = await Promise.allSettled(clients.map((client, i) =>
    reserve(client, 'day-four-' + i, 1_000_000, limits, 0, 1_000)));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.find(r => r.status === 'rejected').reason.code, 'callback_only');
  const shared = await worker().read('spend');
  assert.equal(shared.totals['2026-12'], 25_000_000);
  assert.equal(shared.totals['2026-12-04'], 1_000_000);
});

test('expired settlement markers leave current-period totals and pending holds intact', async t => {
  const { worker, moveClock } = await database(t);
  const start = Date.UTC(2026, 10, 23, 8);
  moveClock(start);
  const [a, b] = [worker(), worker()];
  await reserve(a, 'confirmed', 700, limits, 0, 0);
  await reserve(a, 'rejected', 700, limits, 0, 0);
  await reserve(a, 'pending', 500, limits, 0, 0);
  await settle(b, 'confirmed', 300);
  await settle(b, 'rejected', 0);

  moveClock(start + 7_380_000);
  await assert.rejects(reserve(a, 'confirmed', 700, limits, 0, 0), { status: 409 });

  moveClock(start + 4 * 3_600_000);
  await reserve(b, 'new', 200, limits, 0, 0);
  await settle(a, 'confirmed', 0);
  const ledger = await a.read('spend');
  assert.deepEqual(Object.keys(ledger.holds).sort(), ['new', 'pending']);
  assert.equal(ledger.totals['2026-11-23'], 1000);
  assert.equal(ledger.totals['2026-11'], 1000);
});

test('the database shares rate state, prunes expired guards and refuses a missing ledger', async t => {
  const { db, worker } = await database(t);
  const [a, b] = [worker(), worker()];
  await throttle(a, 'prefix-hash', 'chat', 1, 10_000, 0);
  await assert.rejects(throttle(b, 'prefix-hash', 'chat', 1, 10_000, 0), { status: 429 });
  await db.exec("UPDATE boomy_assistant.control SET expires_at = clock_timestamp() - interval '1 second' WHERE key LIKE 'rate/%'");
  assert.equal(await b.read('rate/prefix-hash/chat'), null);
  await b.update('tickets/fixture', () => ({ used: false }));
  assert.equal((await db.query("SELECT count(*)::integer AS n FROM boomy_assistant.control WHERE key LIKE 'rate/%'")).rows[0].n, 0);
  await db.exec("DELETE FROM boomy_assistant.control WHERE key = 'spend'");
  await assert.rejects(reserve(a, 'missing-ledger', 10, limits, 0, 0), { code: 'callback_only' });
  assert.equal((await db.query("SELECT count(*)::integer AS n FROM boomy_assistant.control WHERE key = 'spend'")).rows[0].n, 0);
});
