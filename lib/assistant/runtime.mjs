import { createHmac, timingSafeEqual, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { isIP } from 'node:net';
import { waitUntil } from '@vercel/functions';
import { InstanceStore } from './instance-store.mjs';
import { fetchReply, createVoice } from './provider.mjs';
import { watchVoice } from './voice-control.mjs';
import { AssistantError, requireValue, sha, uuidPattern } from './state.mjs';
import { chat, lead, voice } from './service.mjs';

const stores = { prod: new InstanceStore(), demo: new InstanceStore() };
const operations = { chat, lead, 'voice-token': voice };
const cookieName = '__Host-boomy_chat';
const canonical = 'https://boomymarketing.com';
const demoMail = async () => 'demo-no-mail';

function cap(name, ceiling) {
  const value = process.env[name] === undefined ? ceiling : Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 && value <= ceiling ? Math.floor(value * 1e6) : 0;
}

async function notify(record, idempotency) {
  const lines = ['Boomy website assistant • ' + record.reference, 'Name: ' + record.name, 'Contact: ' + record.contact,
    'Business: ' + record.businessType, 'Request: ' + record.goal];
  if (record.topics.length) lines.push('Recent topics from the visitor:', ...record.topics);
  if (record.voiceSummary) lines.push('Voice conversation (visitor supplied): ' + record.voiceSummary);
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': idempotency },
    body: JSON.stringify({ from: 'Boomy Marketing <leads@boomymarketing.com>', to: ['boomymarketing.com@gmail.com'],
      subject: 'Boomy website request ' + record.reference, text: lines.join('\n') }) });
  requireValue(res.ok, 503, 'unavailable');
  const { id } = await res.json();
  requireValue(typeof id === 'string' && id.length <= 100, 503, 'unavailable');
  return id;
}

export function context(scope) {
  const key = process.env.OPENAI_API_KEY;
  const mailKey = process.env.RESEND_API_KEY;
  requireValue(mailKey && key, 503, 'unavailable');
  const secret = createHmac('sha256', mailKey).update('boomy-site-chat/conversation/' + scope).digest();
  return { store: stores[scope], now: Date.now(), clock: Date.now,
    limits: scope === 'prod' ? { day: cap('BOOMY_CHAT_DAILY_USD',8), month: cap('BOOMY_CHAT_MONTHLY_USD',25) } : { day: 5e6, month: 5e6 },
    sign: s => createHmac('sha256', secret).update(s).digest('base64url'),
    seal: (purpose, value) => {
      const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm',secret,iv);
      cipher.setAAD(Buffer.from(purpose));
      const data = Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
      return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url');
    },
    unseal: (purpose, value) => {
      if (!value || value.length > 3800 || !/^[\w-]+$/.test(value)) return null;
      try {
        const raw=Buffer.from(value,'base64url');
        const cipher=createDecipheriv('aes-256-gcm',secret,raw.subarray(0,12));
        cipher.setAAD(Buffer.from(purpose)); cipher.setAuthTag(raw.subarray(12,28));
        return JSON.parse(Buffer.concat([cipher.update(raw.subarray(28)),cipher.final()]).toString('utf8'));
      } catch { return null; }
    },
    reply: body => fetchReply(body,key), openVoice: (sdp,history) => createVoice(sdp,history,key),
    watch: (id,deadline) => watchVoice(id,deadline,key), notify: scope === 'prod' ? notify : demoMail,
    background: promise => waitUntil(promise.catch(() => undefined)),
  };
}

function getCookie(req,name) {
  return (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='))?.slice(name.length+1) || '';
}

function setCookie(res,name,value,seconds) {
  const current=res.getHeader('Set-Cookie');
  const next=name+'='+value+'; Path=/; Max-Age='+seconds+'; Secure; HttpOnly; SameSite=Strict';
  res.setHeader('Set-Cookie',[...(current ? [].concat(current) : []),next]);
}

export function visitor(ctx, req, res, body) {
  const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  requireValue(isIP(ip), 503, 'unavailable');
  const value = getCookie(req,cookieName);
  const [raw, stamp, sig] = value.split('.');
  let id = raw;
  const expected = ctx.sign('cookie/' + raw + '/' + stamp);
  if (!(raw?.length === 43 && /^\d{13}$/.test(stamp || '') && Number(stamp) <= ctx.now &&
    ctx.now - Number(stamp) < 3_600_000 && /^[A-Za-z0-9_-]{43}$/.test(sig || '') &&
    timingSafeEqual(Buffer.from(expected),Buffer.from(sig)))) {
    requireValue(uuidPattern.test(body.requestId || ''), 403, 'denied');
    id = ctx.sign('initial/' + ip + '/' + body.requestId);
    const token = id + '.' + ctx.now + '.' + ctx.sign('cookie/' + id + '/' + ctx.now);
    setCookie(res,cookieName,token,3600);
  }
  const sid=sha(id);
  const read=(name,purpose) => {
    const data=ctx.unseal(purpose,getCookie(req,name));
    return data?.sid===sid && data.expires>ctx.now ? data : null;
  };
  const remember=(name,purpose,data,seconds) => {
    const token=ctx.seal(purpose,{...data,sid,expires:ctx.now+seconds*1000});
    if (token.length<=3700) setCookie(res,name,token,seconds);
  };
  return { ...ctx, sid, ip: ctx.sign('ip/' + ip),
    previous:read('__Host-boomy_context','context'),lastCall:read('__Host-boomy_voice','call'),
    remember:data=>remember('__Host-boomy_context','context',data,3600),
    rememberCall:data=>remember('__Host-boomy_voice','call',data,240) };
}

export function handler(action) {
  return async (req,res) => {
    res.setHeader('Cache-Control','private, no-store');
    try {
      requireValue(req.method === 'POST',405,'invalid');
      const scope = process.env.VERCEL_ENV === 'production' ? 'prod' : 'demo';
      const origin = req.headers.origin;
      requireValue(scope === 'prod' ? origin === canonical :
        Boolean(process.env.VERCEL_URL) && origin === 'https://' + process.env.VERCEL_URL,403,'denied');
      requireValue(process.env.BOOMY_CHAT_ENABLED !== 'false',503,'unavailable');
      requireValue(/^application\/json(?:;|$)/i.test(req.headers['content-type'] || ''),415,'invalid');
      const body = req.body;
      requireValue(body && typeof body === 'object' && !Array.isArray(body) && Buffer.byteLength(JSON.stringify(body)) <= 54_000);
      const ctx = visitor(context(scope),req,res,body);
      return res.status(200).json(await operations[action](ctx,body));
    } catch (error) {
      const f = error instanceof AssistantError ? error : new AssistantError(503,'unavailable');
      return res.status(f.status).json({ error: f.code, message: f.message });
    }
  };
}
