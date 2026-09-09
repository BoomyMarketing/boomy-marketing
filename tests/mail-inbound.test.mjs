import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import handler from '../api/mail-inbound.mjs';

const originalFetch = globalThis.fetch;
const originalEnv = { key: process.env.RESEND_API_KEY, secret: process.env.RESEND_INBOUND_WEBHOOK_SECRET };
const key = Buffer.from('unit-test-signing-secret-not-a-real-credential');
const id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of [['RESEND_API_KEY', originalEnv.key], ['RESEND_INBOUND_WEBHOOK_SECRET', originalEnv.secret]]) {
    if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
});

function request(event = {}, age = 0, changeBody = false) {
  process.env.RESEND_API_KEY = 're_unit_test_only';
  process.env.RESEND_INBOUND_WEBHOOK_SECRET = `whsec_${key.toString('base64')}`;
  const payload = JSON.stringify({ type: 'email.received', data: { email_id: id, to: ['care@boomymarketing.com'] }, ...event });
  const timestamp = String(Math.floor(Date.now() / 1000) + age);
  const signature = createHmac('sha256', key).update(`msg_test.${timestamp}.${payload}`).digest('base64');
  return new Request('https://boomymarketing.com/api/mail-inbound', {
    method: 'POST', body: payload + (changeBody ? ' ' : ''),
    headers: { 'content-type': 'application/json', 'svix-id': 'msg_test', 'svix-timestamp': timestamp, 'svix-signature': `v1,${signature}` },
  });
}

const raw = [
  'From: Client <client@example.org>', 'To: care@boomymarketing.com',
  'Reply-To: sales@example.org', 'Subject: Test enquiry', 'MIME-Version: 1.0',
  'Content-Type: multipart/mixed; boundary="test"', '', '--test',
  'Content-Type: text/plain; charset=utf-8', '', 'Please send details.', '--test',
  'Content-Type: text/plain; name="brief.txt"', 'Content-Disposition: attachment; filename="brief.txt"',
  'Content-Transfer-Encoding: base64', '', 'YnJpZWY=', '--test--', '',
].join('\r\n');

function mock(options = {}) {
  const sends = [];
  let reads = 0;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target === `https://api.resend.com/emails/receiving/${id}`) {
      reads++;
      if (options.getFails) return Response.json({ message: 'unavailable' }, { status: 500 });
      return Response.json({ id, from: options.from || 'Client <client@example.org>',
        to: options.to || ['care@boomymarketing.com'], subject: 'Test enquiry',
        raw: { download_url: 'https://storage.resend.com/test.eml' } });
    }
    if (target === 'https://storage.resend.com/test.eml') return new Response(raw);
    if (target === 'https://api.resend.com/emails') {
      sends.push({ body: JSON.parse(init.body), key: new Headers(init.headers).get('idempotency-key') });
      return options.sendFails ? Response.json({ message: 'unavailable' }, { status: 500 }) : Response.json({ id: 'outbound-test' });
    }
    throw new Error('Unexpected network destination');
  };
  return { sends, reads: () => reads };
}

test('rejects GET without sending', async () => {
  const state = mock();
  assert.equal((await handler.fetch(new Request('https://example.org'))).status, 405);
  assert.equal(state.reads(), 0);
});
test('fails closed without production secrets', async () => {
  const req = request(); delete process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  assert.equal((await handler.fetch(req)).status, 503);
});
test('rejects altered signed bytes', async () => {
  const state = mock();
  assert.equal((await handler.fetch(request({}, 0, true))).status, 400);
  assert.equal(state.reads(), 0);
});
test('rejects expired and future signatures', async () => {
  const state = mock();
  for (const age of [-600, 600]) assert.equal((await handler.fetch(request({}, age))).status, 400);
  assert.equal(state.reads(), 0);
});
test('ignores non-receiving events', async () => {
  const state = mock();
  assert.equal((await handler.fetch(request({ type: 'email.sent' }))).status, 200);
  assert.equal(state.reads(), 0);
});
test('ignores another domain and domain-suffix lookalikes', async () => {
  const state = mock();
  for (const to of ['care@foreign.example', 'care@boomymarketing.com.evil.example']) {
    assert.equal((await handler.fetch(request({ data: { email_id: id, to: [to] } }))).status, 200);
  }
  assert.equal(state.reads(), 0);
});
test('rechecks stored recipients, not only event recipients', async () => {
  const state = mock({ to: ['private@unrelated.example'] });
  assert.equal((await handler.fetch(request())).status, 200);
  assert.equal(state.sends.length, 0);
});
test('does not loop mail emitted by our forwarder', async () => {
  const state = mock({ from: 'Boomy Inbox <mail-forward@boomymarketing.com>' });
  assert.equal((await handler.fetch(request())).status, 200);
  assert.equal(state.sends.length, 0);
});
test('preserves reply address and attachment, sends only to owner', async () => {
  const state = mock();
  assert.equal((await handler.fetch(request())).status, 200);
  const sent = state.sends[0];
  assert.deepEqual(sent.body.to, ['boomymarketing.com@gmail.com']);
  assert.equal(sent.body.reply_to, 'sales@example.org');
  assert.equal(sent.body.cc, undefined);
  assert.equal(sent.body.bcc, undefined);
  assert.equal(sent.body.attachments[0].filename, 'brief.txt');
  assert.equal(sent.body.attachments[0].content, 'YnJpZWY=');
  assert.ok(sent.body.text.includes('Please send details.'));
  assert.equal(sent.key, `boomy-inbound-${id}`);
});
test('retries return the same outbound idempotency key', async () => {
  const state = mock();
  await handler.fetch(request()); await handler.fetch(request());
  assert.equal(state.sends[0].key, state.sends[1].key);
});
test('provider failures cause retries instead of acknowledging loss', async () => {
  for (const options of [{ getFails: true }, { sendFails: true }]) {
    mock(options);
    assert.equal((await handler.fetch(request())).status, 502);
  }
});
test('rejects oversized webhook bodies without any provider request', async () => {
  const state = mock();
  assert.equal((await handler.fetch(request({ padding: 'x'.repeat(300000) }))).status, 400);
  assert.equal(state.reads(), 0);
});
