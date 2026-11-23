import { neon } from '@neondatabase/serverless';
import { AssistantError } from './state.mjs';

const lifetime = key => {
  if (key === 'spend') return null;
  if (key.startsWith('tickets/')) return 60_000;
  if (key.startsWith('calls/')) return 3 * 3_600_000;
  return 3_600_000;
};

const readControl = `
  SELECT c.version, CASE WHEN expires_at <= tick.at THEN NULL ELSE state END AS state,
    floor(extract(epoch from tick.at) * 1000)::text AS now_ms
  FROM (SELECT clock_timestamp() AS at) AS tick
  LEFT JOIN boomy_assistant.control AS c ON c.key = $1`;

// Bound housekeeping per write and leave rows locked by other workers alone.
const prune = `WITH expired AS (
    SELECT key FROM boomy_assistant.control
    WHERE expires_at <= statement_timestamp() AND key <> $1
    ORDER BY expires_at LIMIT 16 FOR UPDATE SKIP LOCKED
  ), pruned AS (
    DELETE FROM boomy_assistant.control WHERE key IN (SELECT key FROM expired)
  )`;

const expiry = `statement_timestamp() + $3::integer * interval '1 millisecond'`;
const compareAndSet = `${prune}
  UPDATE boomy_assistant.control SET state = $2::jsonb, version = gen_random_uuid(), expires_at = ${expiry}
  WHERE key = $1 AND version = $4::uuid RETURNING version`;
const create = `${prune}
  INSERT INTO boomy_assistant.control (key, state, expires_at) VALUES ($1, $2::jsonb, ${expiry})
  ON CONFLICT (key) DO NOTHING RETURNING version`;

const unavailable = () => new AssistantError(503, 'callback_only');

export class SharedStore {
  constructor(query) {
    this.query = query;
  }

  async run(statement, parameters, signal) {
    try {
      return await this.query(statement, parameters, { fetchOptions: { signal } });
    } catch {
      throw unavailable();
    }
  }

  async snapshot(key, signal) {
    const [row] = await this.run(readControl, [key], signal);
    if (!row || (key === 'spend' && (!row.version || !row.state))) throw unavailable();
    const now = Number(row.now_ms);
    if (!Number.isSafeInteger(now) || now <= 0) throw unavailable();
    return { ...row, now };
  }

  async read(key) {
    return (await this.snapshot(key, AbortSignal.timeout(4000))).state;
  }

  async update(key, transition) {
    const signal = AbortSignal.timeout(4000);
    for (let attempt = 0; attempt < 8; attempt++) {
      const { state, version, now } = await this.snapshot(key, signal);
      const next = transition(state, now);
      if (next == null) return next;
      const args = [key, JSON.stringify(next), lifetime(key)];
      const rows = version ? await this.run(compareAndSet, [...args, version], signal) :
        await this.run(create, args, signal);
      if (rows.length === 1) return next;
    }
    throw unavailable();
  }
}

export function openSharedStore(url) {
  try {
    return new SharedStore(neon(url).query);
  } catch {
    return new SharedStore();
  }
}
