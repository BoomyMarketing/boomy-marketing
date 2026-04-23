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

  const { name, email, phone, service, message, city } = req.body || {};

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Name and valid email required' });
  }

  const subject = `NEW LEAD [${SITE_LABEL}]${service ? ` — ${service}` : ''}${city ? ` in ${city}` : ''}`;
  const text = [
    `NEW LEAD — ${SITE_LABEL}`,
    '='.repeat(40),
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || '—'}`,
    `Service: ${service || '—'}`,
    `City:    ${city || '—'}`,
    '',
    'Message:',
    message || '—',
    '',
    '='.repeat(40),
    `Time: ${new Date().toISOString()}`,
  ].join('\n');

  const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `<pre style="font-family:system-ui,Segoe UI,monospace;white-space:pre-wrap;font-size:14px">${escapeHtml(text)}</pre>`;

  async function sendOne(to) {
    try {
      const r = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          reply_to: email,
          subject,
          text,
          html,
        }),
      });
      const data = await r.json().catch(() => ({}));
      return { to, ok: r.ok, status: r.status, data };
    } catch (err) {
      return { to, ok: false, error: err.message };
    }
  }

  const results = await Promise.all(TO_EMAILS.map(sendOne));
  const delivered = results.filter(r => r.ok).map(r => r.to);
  const failed = results.filter(r => !r.ok);

  console.log(`Contact form [${SITE_LABEL}] results:`, JSON.stringify(results));

  if (delivered.length === 0) {
    return res.status(500).json({ error: 'Failed to send email', details: failed });
  }

  return res.status(200).json({ success: true, delivered, failed: failed.length ? failed : undefined });
};
