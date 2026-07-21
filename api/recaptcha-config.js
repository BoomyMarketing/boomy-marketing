module.exports = (_req, res) => {
  const projectId = process.env.RECAPTCHA_PROJECT_ID || '';
  const siteKey = process.env.RECAPTCHA_SITE_KEY || '';
  const apiKey = process.env.RECAPTCHA_API_KEY || '';
  const enabled = Boolean(projectId && siteKey && apiKey);

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ enabled, siteKey: enabled ? siteKey : '' });
};
