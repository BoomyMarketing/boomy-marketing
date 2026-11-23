import { createHmac, timingSafeEqual, createCipheriv, createDecipheriv, hkdfSync, randomBytes, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { waitUntil } from '@vercel/functions';
import { InstanceStore } from './instance-store.mjs';
import { openSharedStore } from './shared-store.mjs';
import { fetchReply, createVoice } from './provider.mjs';
import { monitorVoice, stopProviderVoice } from './voice-control.mjs';
import { AssistantError, requireValue, sha, uuidPattern } from './state.mjs';
import { chat, lead, voice, recordClose } from './service.mjs';
import { callbackEmail, callbackHistory, callbackWindows } from './callback.mjs';
import { voiceAdvice } from './voice-advice.mjs';

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
  requireValue(process.env.RESEND_API_KEY, 503, 'unavailable');
  const email = callbackEmail(record);
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': idempotency },
    body: JSON.stringify({ from: 'Boomy Marketing <leads@boomymarketing.com>', to: ['boomymarketing.com@gmail.com'],
      subject: email.subject, text: email.text }) });
  requireValue(res.ok, 503, 'unavailable');
  const { id } = await res.json();
  requireValue(typeof id === 'string' && id.length <= 100, 503, 'unavailable');
  return id;
}

export function context(scope) {
  const key = process.env.OPENAI_API_KEY;
  const mailKey = process.env.RESEND_API_KEY;
  const encoded = process.env.BOOMY_CHAT_SIGNING_SECRET || '';
  requireValue(/^[\w-]{43}$/.test(encoded), 503, 'unavailable');
  const seed = Buffer.from(encoded, 'base64url');
  const derive = purpose => hkdfSync('sha256', seed, 'boomy-site-chat/v2', scope + '/' + purpose, 32);
  const signingKey = derive('sign');
  // Retain the existing Resend idempotency namespace for callback retries during deployment.
  const referenceKey = scope === 'prod' && mailKey ?
    createHmac('sha256', mailKey).update('boomy-site-chat/conversation/prod').digest() : derive('callback-reference');
  const controls = openSharedStore(key ? process.env.BOOMY_CHAT_DATABASE_URL : undefined);
  return { store: stores[scope], controls, now: Date.now(), clock: Date.now,
    limits: scope === 'prod' ? { day: cap('BOOMY_CHAT_DAILY_USD',8), month: cap('BOOMY_CHAT_MONTHLY_USD',25) } : { day: 5e6, month: 5e6 },
    sign: s => createHmac('sha256', signingKey).update(s).digest('base64url'),
    callbackReference: fingerprint => sha(createHmac('sha256', referenceKey).update('callback/' + fingerprint).digest('base64url')),
    seal: (purpose, value) => {
      const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm',derive('seal/' + purpose),iv, { authTagLength: 16 });
      cipher.setAAD(Buffer.from(purpose));
      const data = Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
      return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url');
    },
    unseal: (purpose, value) => {
      if (!value || value.length > 3800 || !/^[\w-]+$/.test(value)) return null;
      try {
        const raw=Buffer.from(value,'base64url');
        const cipher=createDecipheriv('aes-256-gcm',derive('seal/' + purpose),raw.subarray(0,12), { authTagLength: 16 });
        cipher.setAAD(Buffer.from(purpose)); cipher.setAuthTag(raw.subarray(12,28));
        return JSON.parse(Buffer.concat([cipher.update(raw.subarray(28)),cipher.final()]).toString('utf8'));
      } catch { return null; }
    },
    reply: body => fetchReply(body,key), openVoice: (sdp,history) => createVoice(sdp,history,key),
    monitor: (id,deadline,handoff,advice,role) => monitorVoice(id,deadline,key,handoff,advice,role),
    watch: id => stopProviderVoice(id,key), notify: scope === 'prod' ? notify : demoMail,
    handoff: async ticket => {
      const target = scope === 'prod' ? canonical : 'https://' + process.env.VERCEL_URL;
      const res = await fetch(target+'/api/assistant/voice-token',{method:'POST',redirect:'error',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'supervise',ticket}),signal:AbortSignal.timeout(14_000)});
      return res.ok && (await res.json()).attached === true;
    },
    background: promise => waitUntil(promise.catch(() => {console.warn('Boomy voice finalization was unconfirmed');})),
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
  const ip = String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim();
  requireValue(isIP(ip) && !ip.includes('%'), 503, 'unavailable');
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
  return { ...ctx, sid, ip: ctx.sign('ip/' + rateAddress(ip)),
    previous:read('__Host-boomy_context','context'),lastCall:read('__Host-boomy_voice','call'),
    remember:data=>remember('__Host-boomy_context','context',data,3600),
    rememberCall:data=>remember('__Host-boomy_voice','call',data,480) };
}

function rateAddress(ip) {
  if (isIP(ip) === 4) return ip;
  const canonicalIp = new URL('http://[' + ip + ']').hostname.slice(1, -1);
  const [head, tail] = canonicalIp.split('::');
  const leading = head ? head.split(':') : [];
  const trailing = tail ? tail.split(':') : [];
  const words = tail === undefined ? leading : [...leading, ...Array(8 - leading.length - trailing.length).fill('0'), ...trailing];
  if (words.slice(0, 6).join(':') === '0:0:0:0:0:ffff') {
    return words.slice(6).flatMap(word => {
      const value = parseInt(word, 16);
      return [value >> 8, value & 255];
    }).join('.');
  }
  return words.slice(0, 4).join(':') + '::/64';
}

export function handler(action) {
  return async (req,res) => {
    res.setHeader('Cache-Control','private, no-store');
    try {
      const scope = process.env.VERCEL_ENV === 'production' ? 'prod' : 'demo';
      if (action === 'lead' && req.method === 'GET') {
        const ctx = visitor(context(scope),req,res,{requestId:randomUUID()});
        const history = callbackHistory(ctx.previous,await ctx.store.read('chat/'+ctx.sid));
        const summaryToken = ctx.seal('callback-summary',{sid:ctx.sid,history:history.slice(-4),expires:ctx.now+3_600_000});
        return res.status(200).json({ windows: callbackWindows(ctx.now), timeZone: 'America/Toronto', summaryToken });
      }
      requireValue(req.method === 'POST',405,'invalid');
      requireValue(process.env.BOOMY_CHAT_ENABLED !== 'false',503,'unavailable');
      if (action === 'voice-token' && req.body?.action === 'supervise') {
        const ctx = context(scope), call = ctx.unseal('server-sideband',req.body.ticket);
        requireValue(call && !req.headers.origin && uuidPattern.test(call.ref) && typeof call.sid === 'string' && typeof call.upstream === 'string' &&
          call.upstream.length <= 200 && call.deadline > ctx.now && call.deadline - ctx.now <= 235_000,403,'denied');
        await ctx.controls.update('calls/'+call.ref, existing => {
          requireValue(existing?.state === 'open' && !existing.supervised && existing.sid === call.sid &&
            existing.upstream === call.upstream && existing.deadline === call.deadline, 409, 'conflict');
          return { ...existing, supervised: true };
        });
        const advisor=voiceAdvice(ctx,call.ref,undefined,call.history || []);
        const watcher = ctx.monitor(call.upstream,call.deadline,undefined,advisor,'successor');
        ctx.background(watcher.done.then(seconds=>recordClose(ctx,call.ref,seconds)));
        await watcher.ready;
        return res.status(200).json({attached:true});
      }
      const origin = req.headers.origin;
      requireValue(scope === 'prod' ? origin === canonical :
        Boolean(process.env.VERCEL_URL) && origin === 'https://' + process.env.VERCEL_URL,403,'denied');
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
