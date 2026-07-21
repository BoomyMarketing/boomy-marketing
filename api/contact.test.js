const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('./contact');

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function submit(body, ip) {
  const response = createResponse();
  const originalFetch = global.fetch;
  let sendCalls = 0;
  let sentEmail;
  global.fetch = async (_url, options) => {
    sendCalls += 1;
    sentEmail = JSON.parse(options.body);
    return { ok: true, status: 200, json: async () => ({ id: 'test-email' }) };
  };

  try {
    await handler({
      method: 'POST',
      headers: { origin: 'https://boomymarketing.com', 'x-forwarded-for': ip },
      body,
    }, response);
  } finally {
    global.fetch = originalFetch;
  }

  return { response, sendCalls, sentEmail };
}

test('accepts a complete contact-page submission', async () => {
  const { response, sendCalls, sentEmail } = await submit({
    form_type: 'contact',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    service: 'ai-automations',
    budget: '3500-7500',
    message: 'We need help automating lead qualification and follow-up.',
    consent: 'on',
  }, '198.51.100.1');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { success: true });
  assert.equal(sendCalls, 1);
  assert.match(sentEmail.text, /Budget:  3500-7500/);
});

test('accepts an existing SEO landing-page submission without contact-only fields', async () => {
  const { response, sendCalls, sentEmail } = await submit({
    name: 'Jane Smith',
    email: 'jane@company.com',
    phone: '(647) 555-0100',
    service: 'seo agency',
    city: 'Brampton',
    source: '/seo-agency/brampton',
    message: 'We want to improve local search visibility.',
  }, '198.51.100.2');

  assert.equal(response.statusCode, 200);
  assert.equal(sendCalls, 1);
  assert.match(sentEmail.text, /Source:  \/seo-agency\/brampton/);
});

test('accepts the short email CTA used across Astro pages', async () => {
  const { response, sendCalls } = await submit({
    name: 'jane',
    email: 'jane@example.com',
  }, '198.51.100.3');

  assert.equal(response.statusCode, 200);
  assert.equal(sendCalls, 1);
});

test('rejects the random-string spam shown in the inbox', async () => {
  const { response, sendCalls } = await submit({
    name: 'BwJSZXRQuoTlzKXhip',
    email: 'u.z.um.uyec.u8.3.8@gmail.com',
    phone: '9896834063',
    service: 'seo agency',
    city: 'Brampton',
    source: '/seo-agency/brampton',
    message: 'HvepVozLqPFgWdGEUoR',
  }, '198.51.100.4');

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
});

test('rejects bulk link spam before sending an email', async () => {
  const { response, sendCalls } = await submit({
    name: 'Thomas Example',
    email: 'thomas@example.com',
    service: 'seo agency',
    city: 'Toronto',
    source: '/seo-agency/toronto',
    message: 'Links https://a.example https://b.example https://c.example https://d.example',
  }, '198.51.100.5');

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
});

test('rejects a honeypot submission', async () => {
  const { response, sendCalls } = await submit({
    name: 'Bot Example',
    email: 'bot@example.com',
    service: 'seo agency',
    source: '/seo-agency/toronto',
    contact_company: 'filled-by-bot',
  }, '198.51.100.6');

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
});
