module.exports = (_req, res) => {
  const siteKey = process.env.TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITEKEY || '';
  const enabled = Boolean(siteKey && process.env.TURNSTILE_SECRET_KEY);

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ enabled, siteKey: enabled ? siteKey : '' });
};
