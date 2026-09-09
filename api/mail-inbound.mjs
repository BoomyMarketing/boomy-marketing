import { Resend } from 'resend';
import PostalMime from 'postal-mime';

const MAILBOX = 'boomymarketing.com@gmail.com';
const FORWARDER = 'mail-forward@boomymarketing.com';
const DOMAINS = new Set(['boomymarketing.com', 'lumoaiagency.com', 'bambinoagency.com', 'aivopa.com']);
const MAX_EVENT_BYTES = 256 * 1024;
const MAX_EMAIL_BYTES = 25 * 1024 * 1024;

function address(value) {
  const text = String(value || '').trim();
  return (text.match(/<([^<>]+)>$/)?.[1] || text).trim().toLowerCase();
}

function ours(recipients) {
  return Array.isArray(recipients) && recipients.some(value => {
    const email = address(value);
    return /^[^\s@]+@[^\s@]+$/.test(email) && DOMAINS.has(email.split('@')[1]);
  });
}

async function boundedBody(body, maxBytes) {
  const reader = body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error('Body limit exceeded');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
    const apiKey = process.env.RESEND_API_KEY;
    if (!secret || !apiKey) return new Response('Mail routing unavailable', { status: 503 });
    const resend = new Resend(apiKey);
    let event;
    try {
      const payload = (await boundedBody(request.body, MAX_EVENT_BYTES)).toString('utf8');
      event = resend.webhooks.verify({
        payload,
        headers: {
          id: request.headers.get('svix-id'),
          timestamp: request.headers.get('svix-timestamp'),
          signature: request.headers.get('svix-signature'),
        },
        webhookSecret: secret,
      });
    } catch {
      return new Response('Invalid webhook', { status: 400 });
    }
    if (event.type !== 'email.received') return Response.json({ ignored: true });
    if (!ours(event.data?.to)) return Response.json({ ignored: true });
    const id = event.data?.email_id;
    if (!/^[a-f0-9-]{36}$/i.test(id || '')) return new Response('Invalid email id', { status: 400 });

    try {
      const { data: email, error } = await resend.emails.receiving.get(id);
      if (error || !email) throw new Error('Email retrieval failed');
      // Re-check the stored recipient; never forward another domain's mail.
      if (!ours(email.to) || address(email.from) === FORWARDER) return Response.json({ ignored: true });
      const rawUrl = new URL(email.raw?.download_url);
      if (rawUrl.protocol !== 'https:') throw new Error('Invalid raw email URL');
      const raw = await fetch(rawUrl, { signal: AbortSignal.timeout(20000) });
      if (!raw.ok) throw new Error('Raw email retrieval failed');
      const parsed = await PostalMime.parse(await boundedBody(raw.body, MAX_EMAIL_BYTES), { attachmentEncoding: 'base64' });
      const reply = parsed.replyTo?.[0]?.address || parsed.from?.address || address(email.from);
      if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(reply)) throw new Error('Invalid reply address');
      const source = `Forwarded business email\nFrom: ${email.from}\nTo: ${email.to.join(', ')}\n\n`;
      const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const attachments = (parsed.attachments || []).map(item => ({
        filename: item.filename || 'attachment',
        content: item.content,
        contentType: item.mimeType,
        contentId: item.contentId?.replace(/^<|>$/g, ''),
      }));
      const result = await resend.emails.send({
        from: `Boomy Inbox <${FORWARDER}>`,
        to: [MAILBOX],
        replyTo: reply,
        subject: email.subject || '(no subject)',
        text: source + (parsed.text || '(HTML email; see HTML version)'),
        html: parsed.html ? `<pre>${escape(source)}</pre>${parsed.html}` : undefined,
        attachments: attachments.length ? attachments : undefined,
        headers: { 'X-Boomy-Inbound-ID': id, 'Auto-Submitted': 'auto-generated' },
      }, { idempotencyKey: `boomy-inbound-${id}` });
      if (result.error || !result.data?.id) throw new Error('Forwarding failed');
      console.info('Business email forwarded', { inboundId: id, outboundId: result.data.id });
      return Response.json({ forwarded: true });
    } catch {
      // Return an error so Resend retries. Never log message content or signed URLs.
      console.error('Business email forwarding requires retry', { inboundId: id });
      return new Response('Forwarding unavailable; retry required', { status: 502 });
    }
  },
};
