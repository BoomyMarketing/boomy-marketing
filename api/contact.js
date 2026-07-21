const SITE_LABEL = 'Boomy Marketing';
const FROM_EMAIL = 'Boomy Marketing <leads@boomymarketing.com>';
const TO_EMAILS = ['boomymarketing.com@gmail.com', 'evgeniygalyas@gmail.com'];
const RESEND_URL = 'https://api.resend.com/emails';
const ALLOWED_ORIGINS = new Set([
  'https://boomymarketing.com',
  'https://www.boomymarketing.com',
]);
const CONTACT_SERVICES = new Set([
  'seo', 'ecommerce-seo', 'geo', 'google-ads', 'meta-ads', 'ai-automations',
  'ai-development', 'web-design', 'saas', 'voice-ai', 'email-marketing',
  'ai-outbound', 'social-media', 'content-marketing', 'ppc', 'multiple',
]);
const CONTACT_BUDGETS = new Set([
  'under-1500', '1500-3500', '3500-7500', '7500-15000', '15000plus',
]);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestLog = new Map();

function pick(body, ...keys) {
  for (const key of keys) {
    const value = body[key];
    if (value != null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}

function joinName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

function isAllowedOrigin(origin) {
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function getClientIp(req) {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers?.['x-real-ip'] || 'unknown';
}

function isRateLimited(ip, now) {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const attempts = (requestLog.get(ip) || []).filter((timestamp) => timestamp > cutoff);
  if (attempts.length >= RATE_LIMIT_MAX_REQUESTS) return true;

  attempts.push(now);
  requestLog.set(ip, attempts);
  return false;
}

function looksLikeRandomToken(value) {
  const token = value.trim();
  if (token.length < 14 || /\s/.test(token) || !/^[a-z0-9]+$/i.test(token)) return false;

  let caseChanges = 0;
  for (let index = 1; index < token.length; index += 1) {
    if (/[a-z]/.test(token[index - 1]) && /[A-Z]/.test(token[index])) caseChanges += 1;
  }
  return caseChanges >= 3;
}

function isObviousSpam({ name, email, message }) {
  const emailName = email.split('@')[0] || '';
  const linkCount = (message.match(/(?:https?:\/\/|www\.)\S+/gi) || []).length;
  const generatedEmailName = looksLikeRandomToken(emailName)
    || (emailName.length >= 12 && /^[a-z0-9]+(?:\.[a-z0-9]+){3,}$/i.test(emailName));
  if (linkCount >= 4) return true;
  return looksLikeRandomToken(name) && generatedEmailName && looksLikeRandomToken(message);
}

function getFormType({ requestedType, service, budget, consent, source, city, message }) {
  if (['contact', 'landing', 'cta'].includes(requestedType)) return requestedType;
  if (budget || consent) return 'contact';
  if (service || source || city || message) return 'landing';
  return 'cta';
}

function isValidSubmission(lead) {
  const {
    formType, name, email, phone, service, budget, message, consent,
    city, source, company, website, honeypot,
  } = lead;

  if (honeypot) return false;
  if (name.length < 1 || name.length > 120) return false;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  if (phone.length > 50 || city.length > 100 || source.length > 300) return false;
  if (company.length > 150 || website.length > 300 || message.length > 5000) return false;
  if (isObviousSpam({ name, email, message })) return false;

  if (formType === 'contact') {
    return CONTACT_SERVICES.has(service)
      && CONTACT_BUDGETS.has(budget)
      && ['on', 'true', 'yes', '1'].includes(consent.toLowerCase())
      && message.length >= 3;
  }

  if (formType === 'landing') {
    return service.length >= 2 && service.length <= 100;
  }

  return formType === 'cta' && !service && !budget && !message;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const origin = req.headers?.origin;
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: 'Invalid request origin' });

  const body = req.body || {};
  const name = pick(body, 'name', 'full_name', 'fullName')
    || joinName(pick(body, 'firstName', 'first_name', 'fname'), pick(body, 'lastName', 'last_name', 'lname'));
  const email = pick(body, 'email');
  const phone = pick(body, 'phone', 'tel');
  const service = pick(body, 'service');
  const message = pick(body, 'message', 'goals', 'note', 'notes');
  const city = pick(body, 'city', 'location');
  const company = pick(body, 'company', 'business', 'companyName');
  const website = pick(body, 'website', 'url', 'site');
  const budget = pick(body, 'budget', 'monthly_budget', 'monthlyBudget');
  const consent = pick(body, 'consent', 'gdpr');
  const source = pick(body, 'source', 'page_url', 'referrer');
  const honeypot = pick(body, 'contact_company');
  const requestedType = pick(body, 'form_type');
  const formType = getFormType({ requestedType, service, budget, consent, source, city, message });
  const lead = {
    formType, name, email, phone, service, budget, message, consent,
    city, source, company, website, honeypot,
  };

  if (!isValidSubmission(lead)) {
    return res.status(400).json({ error: 'Please complete the form with valid details.' });
  }

  const now = Date.now();
  if (isRateLimited(getClientIp(req), now)) {
    return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
  }

  const subject = `NEW LEAD [${SITE_LABEL}]${service ? ` - ${service}` : ''}${city ? ` in ${city}` : ''}`;
  const lines = [
    `NEW LEAD - ${SITE_LABEL}`,
    '='.repeat(40),
    `Form:    ${formType}`,
    `Name:    ${name}`,
    `Email:   ${email}`,
  ];
  if (phone) lines.push(`Phone:   ${phone}`);
  if (company) lines.push(`Company: ${company}`);
  if (website) lines.push(`Website: ${website}`);
  if (city) lines.push(`City:    ${city}`);
  if (service) lines.push(`Service: ${service}`);
  if (budget) lines.push(`Budget:  ${budget}`);
  if (consent) lines.push(`Consent: ${consent}`);
  if (source) lines.push(`Source:  ${source}`);
  lines.push('', 'Message:', message || '-', '', '='.repeat(40), `Time: ${new Date().toISOString()}`);
  const text = lines.join('\n');

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const html = `<pre style="font-family:system-ui,Segoe UI,monospace;white-space:pre-wrap;font-size:14px">${escapeHtml(text)}</pre>`;

  let result;
  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAILS,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    const data = await response.json().catch(() => ({}));
    result = { ok: response.ok, status: response.status, data };
  } catch (error) {
    result = { ok: false, error: error.message };
  }

  console.log(`Contact form [${SITE_LABEL}] result:`, JSON.stringify(result));

  if (!result.ok) return res.status(500).json({ error: 'Failed to send email' });

  return res.status(200).json({ success: true });
};
