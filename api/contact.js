const nodemailer = require('nodemailer');

const SITE_LABEL = 'Boomy Marketing';
const TO_EMAIL   = 'petrusenkocorp@gmail.com';

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

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${SITE_LABEL}" <${process.env.GMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
