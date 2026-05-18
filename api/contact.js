const SITE_LABEL = 'Boomy Marketing';
const FROM_EMAIL = 'Boomy Marketing <leads@boomymarketing.com>';
const TO_EMAILS  = ['boomymarketing.com@gmail.com', 'evgeniygalyas@gmail.com'];
const RESEND_URL = 'https://api.resend.com/emails';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const pick = (...keys) => { for (const k of keys) { const v = body[k]; if (v != null && String(v).trim() !== '') return String(v).trim(); } return ''; };
  const joinName = (a, b) => [a, b].filter(Boolean).join(' ').trim();

  const name = pick('name', 'full_name', 'fullName')
    || joinName(pick('firstName'), pick('lastName'))
    || joinName(pick('first_name'), pick('last_name'))
    || joinName(pick('fname'), pick('lname'));

  const email   = pick('email');
  const phone   = pick('phone', 'tel');
  const service = pick('service');
  const message = pick('message', 'goals', 'note', 'notes');
  const city    = pick('city', 'location');
  const company = pick('company', 'business', 'companyName');
  const website = pick('website', 'url', 'site');
  const budget  = pick('budget', 'monthly_budget', 'monthlyBudget');
  const source  = pick('source', 'page_url', 'referrer');
  const consent = pick('consent', 'gdpr');

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Name and valid email required' });
  }

  const subject = `🔥 NEW LEAD [${SITE_LABEL}]${service ? ` — ${service}` : ''}${city ? ` in ${city}` : ''}`;
  const lines = [
    `NEW LEAD — ${SITE_LABEL}`,
    '='.repeat(40),
    `Name:    ${name}`,
    `Email:   ${email}`,
  ];
  if (phone)   lines.push(`Phone:   ${phone}`);
  if (company) lines.push(`Company: ${company}`);
  if (website) lines.push(`Website: ${website}`);
  if (city)    lines.push(`City:    ${city}`);
  if (service) lines.push(`Service: ${service}`);
  if (budget)  lines.push(`Budget:  ${budget}`);
  if (consent) lines.push(`Consent: ${consent}`);
  if (source)  lines.push(`Source:  ${source}`);
  lines.push('', 'Message:', message || '—', '', '='.repeat(40), `Time: ${new Date().toISOString()}`);
  const text = lines.join('\n');

  const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `<pre style="font-family:system-ui,Segoe UI,monospace;white-space:pre-wrap;font-size:14px">${escapeHtml(text)}</pre>`;

  let result;
  try {
    const r = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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
    const data = await r.json().catch(() => ({}));
    result = { ok: r.ok, status: r.status, data };
  } catch (err) {
    result = { ok: false, error: err.message };
  }

  console.log(`Contact form [${SITE_LABEL}] result:`, JSON.stringify(result));

  if (!result.ok) {
    return res.status(500).json({ error: 'Failed to send email', details: result });
  }

  return res.status(200).json({ success: true, recipients: TO_EMAILS });
};
