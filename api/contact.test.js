const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('./contact');
const recaptchaConfigHandler = require('./recaptcha-config');

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
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

test('only exposes the public reCAPTCHA site key when all server settings are configured', () => {
  const originalProjectId = process.env.RECAPTCHA_PROJECT_ID;
  const originalSiteKey = process.env.RECAPTCHA_SITE_KEY;
  const originalApiKey = process.env.RECAPTCHA_API_KEY;
  process.env.RECAPTCHA_PROJECT_ID = 'test-project';
  process.env.RECAPTCHA_SITE_KEY = 'public-site-key';
  process.env.RECAPTCHA_API_KEY = 'private-api-key';
  const response = createResponse();

  try {
    recaptchaConfigHandler({}, response);
  } finally {
    if (originalProjectId == null) delete process.env.RECAPTCHA_PROJECT_ID;
    else process.env.RECAPTCHA_PROJECT_ID = originalProjectId;
    if (originalSiteKey == null) delete process.env.RECAPTCHA_SITE_KEY;
    else process.env.RECAPTCHA_SITE_KEY = originalSiteKey;
    if (originalApiKey == null) delete process.env.RECAPTCHA_API_KEY;
    else process.env.RECAPTCHA_API_KEY = originalApiKey;
  }

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { enabled: true, siteKey: 'public-site-key' });
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.doesNotMatch(JSON.stringify(response.body), /private-api-key|test-project/);
});

async function submit(body, ip, options = {}) {
  const response = createResponse();
  const originalFetch = global.fetch;
  const originalProjectId = process.env.RECAPTCHA_PROJECT_ID;
  const originalSiteKey = process.env.RECAPTCHA_SITE_KEY;
  const originalApiKey = process.env.RECAPTCHA_API_KEY;
  let sendCalls = 0;
  let verifyCalls = 0;
  let sentEmail;
  let verificationBody;

  if (options.recaptcha) {
    process.env.RECAPTCHA_PROJECT_ID = 'test-project';
    process.env.RECAPTCHA_SITE_KEY = 'test-site-key';
    process.env.RECAPTCHA_API_KEY = 'test-api-key';
  } else {
    delete process.env.RECAPTCHA_PROJECT_ID;
    delete process.env.RECAPTCHA_SITE_KEY;
    delete process.env.RECAPTCHA_API_KEY;
  }

  global.fetch = async (url, fetchOptions) => {
    if (String(url).includes('recaptchaenterprise.googleapis.com')) {
      verifyCalls += 1;
      verificationBody = JSON.parse(fetchOptions.body);
      if (options.verificationError) throw new Error('reCAPTCHA unavailable');
      return {
        ok: options.verificationHttpOk !== false,
        status: options.verificationHttpOk === false ? 503 : 200,
        json: async () => options.verificationResult || {
          tokenProperties: {
            valid: true,
            action: 'contact',
            hostname: 'boomymarketing.com',
          },
          riskAnalysis: { score: 0.9 },
        },
      };
    }

    sendCalls += 1;
    sentEmail = JSON.parse(fetchOptions.body);
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
    if (originalProjectId == null) delete process.env.RECAPTCHA_PROJECT_ID;
    else process.env.RECAPTCHA_PROJECT_ID = originalProjectId;
    if (originalSiteKey == null) delete process.env.RECAPTCHA_SITE_KEY;
    else process.env.RECAPTCHA_SITE_KEY = originalSiteKey;
    if (originalApiKey == null) delete process.env.RECAPTCHA_API_KEY;
    else process.env.RECAPTCHA_API_KEY = originalApiKey;
  }

  return { response, sendCalls, verifyCalls, verificationBody, sentEmail };
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

test('rejects the Russian gambling-link spam shown in the inbox', async () => {
  const { response, sendCalls } = await submit({
    form_type: 'landing',
    name: 'mostbet_tmKI',
    email: 'gegfzaixvKI@zvukovoe-oborudovanie12.ru',
    phone: '85165488638',
    city: 'Toronto',
    service: 'ai automation agency',
    message: 'Ищете место для игры? <a href=https://mostbet-rfd.com.kg>скачать mostbet</a>',
  }, '198.51.100.7');

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
});

test('does not reject a legitimate Russian-language enquiry', async () => {
  const { response, sendCalls } = await submit({
    form_type: 'landing',
    name: 'Ivan Petrov',
    email: 'ivan@example.com',
    phone: '+1 647 555 0101',
    city: 'Toronto',
    service: 'ai automation agency',
    message: 'Здравствуйте, нужна автоматизация обработки заявок для нашей компании.',
  }, '198.51.100.8');

  assert.equal(response.statusCode, 200);
  assert.equal(sendCalls, 1);
});

test('requires a reCAPTCHA token when production keys are configured', async () => {
  const { response, sendCalls, verifyCalls } = await submit({
    name: 'Jane Smith',
    email: 'jane@company.com',
    service: 'seo agency',
    city: 'Toronto',
    message: 'We need help with local SEO.',
  }, '198.51.100.9', { recaptcha: true });

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
  assert.equal(verifyCalls, 0);
});

test('accepts a normal lead after successful reCAPTCHA verification', async () => {
  const { response, sendCalls, verifyCalls, verificationBody } = await submit({
    name: 'Jane Smith',
    email: 'jane@company.com',
    service: 'seo agency',
    city: 'Toronto',
    message: 'We need help with local SEO.',
    recaptcha_token: 'valid-test-token',
  }, '198.51.100.10', { recaptcha: true });

  assert.equal(response.statusCode, 200);
  assert.equal(sendCalls, 1);
  assert.equal(verifyCalls, 1);
  assert.equal(verificationBody.event.token, 'valid-test-token');
  assert.equal(verificationBody.event.siteKey, 'test-site-key');
  assert.equal(verificationBody.event.expectedAction, 'contact');
  assert.equal(verificationBody.event.userIpAddress, '198.51.100.10');
});

test('rejects a lead when reCAPTCHA reports an invalid token', async () => {
  const { response, sendCalls, verifyCalls } = await submit({
    name: 'Jane Smith',
    email: 'jane@company.com',
    service: 'seo agency',
    city: 'Toronto',
    message: 'We need help with local SEO.',
    recaptcha_token: 'invalid-test-token',
  }, '198.51.100.11', {
    recaptcha: true,
    verificationResult: {
      tokenProperties: { valid: false, invalidReason: 'INVALID_REASON_UNSPECIFIED' },
    },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
  assert.equal(verifyCalls, 1);
});

test('rejects only the lowest reCAPTCHA risk score', async () => {
  const { response, sendCalls, verifyCalls } = await submit({
    name: 'Jane Smith',
    email: 'jane@company.com',
    service: 'seo agency',
    city: 'Toronto',
    message: 'We need help with local SEO.',
    recaptcha_token: 'low-score-test-token',
  }, '198.51.100.12', {
    recaptcha: true,
    verificationResult: {
      tokenProperties: {
        valid: true,
        action: 'contact',
        hostname: 'boomymarketing.com',
      },
      riskAnalysis: { score: 0.1 },
    },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(sendCalls, 0);
  assert.equal(verifyCalls, 1);
});

test('does not lose a normal lead during a reCAPTCHA service outage', async () => {
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const { response, sendCalls, verifyCalls } = await submit({
      name: 'Jane Smith',
      email: 'jane@company.com',
      service: 'seo agency',
      city: 'Toronto',
      message: 'We need help with local SEO.',
      recaptcha_token: 'valid-test-token',
    }, '198.51.100.13', { recaptcha: true, verificationError: true });

    assert.equal(response.statusCode, 200);
    assert.equal(sendCalls, 1);
    assert.equal(verifyCalls, 1);
  } finally {
    console.error = originalConsoleError;
  }
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
