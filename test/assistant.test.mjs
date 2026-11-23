import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { context, visitor, handler } from '../lib/assistant/runtime.mjs';
import { InstanceStore } from '../lib/assistant/instance-store.mjs';
import { responseBody, textReserve } from '../lib/assistant/provider.mjs';
import { chat, lead, voice, stopVoice, recordClose } from '../lib/assistant/service.mjs';
import { callbackWindows, callbackEmail, callbackHistory } from '../lib/assistant/callback.mjs';
import { monitorVoice } from '../lib/assistant/voice-control.mjs';
import { voiceAdvice } from '../lib/assistant/voice-advice.mjs';
import { AssistantError, reserve, settle, sha, throttle, voiceReserve } from '../lib/assistant/state.mjs';

process.env.BOOMY_CHAT_SIGNING_SECRET = Buffer.alloc(32, 7).toString('base64url');

function fixture() {
  const data = new Map(), jobs = [], sends = new Set(), stats = { replies: 0, sessions: 0, watches: 0 };
  const store = { async read(key) { return structuredClone(data.get(key) ?? null); },
    async update(key, transition) {
      const value = transition(structuredClone(data.get(key) ?? null));
      if (value != null) data.set(key, value);
      return structuredClone(value);
    } };
  process.env.OPENAI_API_KEY = 'fixture-model'; process.env.RESEND_API_KEY = 'fixture-mail';
  const { seal, unseal } = context('demo');
  const ctx = { store, controls: store, seal, unseal, now: Date.UTC(2026, 10, 30, 23, 59, 59), sid: 'visitor-a', ip: 'client-a',
    callbackReference: fingerprint => sha('callback/' + fingerprint),
    limits: { day: 8e6, month: 25e6 }, sign: s => createHash('sha256').update(s).digest('base64url'),
    clock: () => ctx.now, background: () => {}, enqueue: async (job, delay, id) => { jobs.push({ ...job, delay, id }); },
    reply: async () => { stats.replies++; return { reply: 'Проверенный ответ', charged: 321 }; },
    notify: async (record, key) => { sends.add(key); return 'mock-receipt'; },
    openVoice: async () => { stats.sessions++; return { upstream: 'test-upstream', sdp: 'v=0\r\n' }; },
    monitor: () => ({ready:Promise.resolve(),done:new Promise(()=>{})}), handoff:async()=>true,
    watch: async () => { stats.watches++; return 21; } };
  return { ctx, data, jobs, sends, stats };
}

test('concurrent budget reservations enforce both UTC days and months; settlement is idempotent', async () => {
  const { ctx, data } = fixture();
  const attempts = await Promise.allSettled(['a','b'].map(id => reserve(ctx.store, id, 700, { day: 1000, month: 1800 }, ctx.now, 120000)));
  assert.equal(attempts.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(attempts.find(x => x.status === 'rejected').reason.status, 429);
  for (const k of ['2026-11','2026-12','2026-11-30','2026-12-01']) assert.equal(data.get('spend').totals[k], 700);
  await settle(ctx.store,'a',25); await settle(ctx.store,'a',25);
  assert.ok(Object.values(data.get('spend').totals).every(x => x === 25));
});

test('turn retry returns the saved answer and a conflicting reuse is refused', async () => {
  const { ctx, stats } = fixture();
  const turn = { requestId: randomUUID(), message: 'Кто вы?' };
  assert.deepEqual(await chat(ctx, turn), await chat(ctx, turn));
  await assert.rejects(chat(ctx, { ...turn, message: 'Другая тема' }), {status: 409});
  assert.equal(stats.replies, 1);
});

test('unconfirmed provider attempts keep the money reserved and cannot be replayed', async () => {
  const { ctx, data } = fixture(); ctx.reply = async () => { throw Error('connection lost'); };
  const body = { requestId: randomUUID(), message: 'Консультация' };
  await assert.rejects(chat(ctx, body)); await assert.rejects(chat(ctx,body), {status: 409});
  assert.equal(Object.keys(data.get('spend').holds).length, 1);
});

test('per-IP sliding windows survive parallel calls and recover after expiration', async () => {
  const { ctx } = fixture();
  const done = await Promise.allSettled(Array.from({length: 7}, () => throttle(ctx.store,ctx.ip,'t',3,1000,ctx.now)));
  assert.equal(done.filter(x => x.status === 'fulfilled').length, 3);
  await throttle(ctx.store,ctx.ip,'t',3,1000,ctx.now+1000);
});

function sampleCallback(now) {
  return {requestId:randomUUID(),name:'Pat',phone:'+1 416 555 0100',email:'pat@example.com',
    businessType:'Salon',serviceInterest:'Google Ads',goal:'More weekday bookings',windowId:callbackWindows(now)[0].id,consent:true};
}

test('paid requests fail closed when the shared store is unavailable while callbacks still work', async () => {
  const { ctx, stats, sends } = fixture();
  ctx.controls = {
    async read() { throw new AssistantError(503, 'callback_only'); },
    async update() { throw new AssistantError(503, 'callback_only'); },
  };
  await assert.rejects(chat(ctx, { message: 'What does Boomy do?', requestId: randomUUID() }), { code: 'callback_only' });
  await assert.rejects(voice(ctx, { action: 'issue', requestId: randomUUID() }), { code: 'callback_only' });
  assert.equal(stats.replies, 0);
  assert.equal(stats.sessions, 0);
  assert.equal((await lead(ctx, sampleCallback(ctx.now))).status, 'received');
  assert.equal(sends.size, 1);
});

function setAssistantEnv(t, overrides = {}) {
  const values = { VERCEL_ENV: 'production', VERCEL_URL: 'boomy-fixture.invalid',
    OPENAI_API_KEY: 'fixture-model', BOOMY_CHAT_DATABASE_URL: 'postgres://fixture:fixture@ledger.invalid/test',
    BOOMY_CHAT_DAILY_USD: '8', BOOMY_CHAT_MONTHLY_USD: undefined, BOOMY_CHAT_ENABLED: undefined,
    BOOMY_CHAT_DISABLED: undefined, BOOMY_CHAT_SHARED_LEDGER_ENABLED: undefined, ...overrides };
  for (const [name, value] of Object.entries(values)) {
    const previous = process.env[name];
    t.after(() => { if (previous === undefined) delete process.env[name]; else process.env[name] = previous; });
    if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
}

async function assistantRequest(action, body, cookie, method = body ? 'POST' : 'GET') {
  const headers = new Map();
  const origin = process.env.VERCEL_ENV === 'production' ? 'https://boomymarketing.com' : 'https://boomy-fixture.invalid';
  const req = { method, body,
    headers: { 'x-vercel-forwarded-for': '192.0.2.4', 'content-type': 'application/json', origin, cookie } };
  const res = { getHeader: name => headers.get(name), setHeader: (name, value) => headers.set(name, value),
    status(code) { this.code = code; return this; }, json(payload) { return { code: this.code, payload, headers }; },
    end() { return this.json(); } };
  return handler(action)(req, res);
}

test('local spend survives idle expiry across UTC midnight', async t => {
  let now = Date.UTC(2026, 10, 30, 23, 59, 59);
  t.mock.method(Date, 'now', () => now);
  const store = new InstanceStore();
  const limits = { day: 2e6, month: 25e6 };
  const attempts = await Promise.allSettled(['one', 'two'].map(id => reserve(store, id, 1.2e6, limits, now, 120000)));
  assert.deepEqual(attempts.map(attempt => attempt.status), ['fulfilled', 'rejected']);
  assert.equal(attempts[1].reason.code, 'callback_only');
  assert.equal(store.read('spend').totals['2026-12-01'], 1.2e6);
  store.update('chat/fixture', () => ({ temporary: true }));
  now += 3_700_000;
  assert.equal(store.read('chat/fixture'), null);
  await assert.rejects(reserve(store, 'over', 800001, limits, now, 120000), { code: 'callback_only' });
  await reserve(store, 'exact', 8e5, limits, now, 120000);
  assert.equal(store.read('spend').totals['2026-12-01'], 2e6);
  await reserve(new InstanceStore(), 'independent', 2e6, limits, now, 120000);
});

test('default local runtime clamps an old USD 8 setting and holds ambiguous text spend', async t => {
  setAssistantEnv(t);
  t.mock.method(Date, 'now', () => Date.UTC(2026, 10, 23, 12));
  const calls = [];
  t.mock.method(globalThis, 'fetch', async url => {
    calls.push(String(url));
    throw new Error('Ambiguous fixture response');
  });
  const ctx = context('prod');
  assert.equal(ctx.controls, ctx.store);
  assert.equal(ctx.limits.day, 2e6);
  const message = 'What can you help my company with?';
  const charge = textReserve(responseBody([], message));
  await reserve(ctx.controls, 'prefill', 2e6 - charge, ctx.limits, ctx.now, 68_000);
  const replies = await Promise.all(Array.from({ length: 2 }, () =>
    assistantRequest('chat', { message, requestId: randomUUID() })));
  assert.deepEqual(replies.map(r => [r.code, r.payload.error]).sort(), [[429, 'callback_only'], [503, 'unavailable']]);
  const mode = await assistantRequest('lead', undefined, undefined, 'HEAD');
  assert.equal(mode.code, 200);
  assert.equal(mode.headers.get('X-Boomy-Assistant-Mode'), 'text');
  assert.equal(mode.headers.has('Set-Cookie'), false);
  for (const action of ['issue', 'connect', 'supervise']) {
    assert.equal((await assistantRequest('voice-token', { action, requestId: randomUUID() })).payload.error, 'callback_only');
  }
  assert.deepEqual(calls, ['https://api.openai.com/v1/responses']);
  assert.equal(ctx.controls.read('spend').totals[new Date(ctx.now).toISOString().slice(0, 10)], 2e6);
});

test('kill switch overrides a shared-ledger opt-in and still accepts a demo callback', async t => {
  setAssistantEnv(t, { VERCEL_ENV: 'preview', BOOMY_CHAT_DISABLED: 'true', BOOMY_CHAT_SHARED_LEDGER_ENABLED: 'true' });
  const outbound = t.mock.method(globalThis, 'fetch', async () => { throw Error('Unexpected outbound call'); });
  assert.equal(context('demo').controls, context('demo').store);
  const result = await assistantRequest('lead');
  assert.equal(result.code, 200);
  assert.equal(result.headers.get('X-Boomy-Assistant-Mode'), 'callback-only');
  assert.equal(result.payload.windows.length, 3);
  const cookie = result.headers.get('Set-Cookie').map(value => value.split(';')[0]).join('; ');
  assert.equal((await assistantRequest('chat', { message: 'Hello', requestId: randomUUID() }, cookie)).payload.error, 'callback_only');
  for (const action of ['issue', 'connect', 'supervise']) {
    assert.equal((await assistantRequest('voice-token', { action }, cookie)).payload.error, 'callback_only');
  }
  const callback = await assistantRequest('lead', { ...sampleCallback(Date.now()), summaryToken: result.payload.summaryToken }, cookie);
  assert.equal(callback.payload.status, 'received');
  assert.equal(outbound.mock.callCount(), 0);
});

test('shared-ledger opt-in with a missing URL fails closed without a local paid fallback', async t => {
  setAssistantEnv(t, { BOOMY_CHAT_SHARED_LEDGER_ENABLED: 'true', BOOMY_CHAT_DATABASE_URL: undefined });
  const outbound = t.mock.method(globalThis, 'fetch', async () => { throw Error('Unexpected outbound call'); });
  assert.notEqual(context('prod').controls, context('prod').store);
  const reply = await assistantRequest('chat', { message: 'Hello', requestId: randomUUID() });
  assert.equal(reply.payload.error, 'callback_only');
  assert.equal(outbound.mock.callCount(), 0);
});

test('local controls allow signed teardown of an earlier voice call', async () => {
  const { ctx, stats } = fixture();
  const ref = randomUUID();
  const controls = new InstanceStore();
  const lastCall = { ref, sid: ctx.sid, upstream: 'earlier-call', deadline: ctx.now + 1000, state: 'open' };
  await stopVoice({ ...ctx, controls, lastCall }, ref, true);
  assert.equal(stats.watches, 1);
  assert.equal(controls.read('spend'), null);
});

test('only the confirmed owner email is a receipt; cold retries reuse the same provider key', async () => {
  const {ctx, sends} = fixture();
  const body = sampleCallback(ctx.now);
  await assert.rejects(lead(ctx,{...body,consent:false}),{status:400});
  for (const invalid of [{phone:'123'},{phone:'call 416 555 0100'},{email:'a@example.com,b@example.com'},{email:''},{serviceInterest:''},{windowId:'yesterday'}]) {
    await assert.rejects(lead(ctx,{...body,...invalid}),{status:400});
  }
  const first=await lead(ctx,body);
  const again=await lead({...ctx,store:new InstanceStore()}, {...body,requestId:randomUUID()});
  assert.deepEqual(first,again); assert.equal(sends.size,1);
  assert.equal(first.window,callbackWindows(ctx.now)[0].label);
});

test('inline owner delivery failure is visible and confirmed replay recovers', async () => {
  const {ctx}=fixture();
  const body=sampleCallback(ctx.now);
  const keys=[];
  ctx.notify=async (_,key)=>{keys.push(key); throw Error('unknown mail response');};
  await assert.rejects(lead(ctx,body));
  ctx.notify=async (_,key)=>{keys.push(key);return 'accepted';};
  assert.equal((await lead(ctx,body)).status,'received'); assert.equal(new Set(keys).size,1);
});

test('Toronto callback windows use local working days, local time changes and three future choices', () => {
  const sun=callbackWindows(Date.parse('2026-11-01T16:00:00Z'));
  assert.deepEqual(sun.map(w=>w.id),['2026-11-02-am','2026-11-02-pm','2026-11-03-am']);
  assert.ok(sun.every(w=>w.timeZone==='America/Toronto' && w.label.includes('Toronto time')));
  assert.equal(callbackWindows(Date.parse('2026-07-06T13:01:00Z'))[0].id,'2026-07-06-pm');
  assert.equal(callbackWindows(Date.parse('2026-11-02T13:01:00Z'))[0].id,'2026-11-02-am');
});

test('callback notice contains the accepted window, sales brief, typed context and voice summary', async () => {
  const {ctx}=fixture();
  ctx.previous={history:[{role:'user',content:'We only want weekday calls.'},{role:'assistant',content:'We can review search intent.'}]};
  let mail;
  ctx.notify=async record=>{mail=callbackEmail(record);return 'accepted';};
  const receipt=await lead(ctx,{...sampleCallback(ctx.now),voiceSummary:'Visitor: We use Shopify.',budget:'CAD 1200'});
  assert.equal(mail.subject,'CALL REQUEST '+receipt.reference);
  for(const part of [receipt.window,'Sales brief','CAD 1200','Conversation summary','weekday calls','search intent','Shopify']) assert.ok(mail.text.includes(part));
});

test('callback email quotes and flattens visitor lines and defangs excerpt links', async () => {
  const { ctx } = fixture();
  ctx.previous = { history: [{ role: 'assistant', content: 'Quoted excerpt\nPhone: untrusted https://example.com' }] };
  let mail;
  ctx.notify = async record => { mail = callbackEmail(record); return 'accepted'; };
  await lead(ctx, { ...sampleCallback(ctx.now), voiceSummary: 'Voice note\nCallback window: untrusted' });
  assert.match(mail.text, /^> AI assistant \(unverified\): Quoted excerpt Phone: untrusted hxxp\[:\]\/\/example\[\.\]com$/m);
  assert.match(mail.text, /^> Voice note Callback window: untrusted$/m);
  assert.equal(mail.text.split('\n').filter(line => line.startsWith('Callback window:')).length, 1);
});

const offer = 'v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n';
test('encrypted cookies preserve topics across handlers and reject tampering', () => {
  const {ctx}=fixture();
  const real=context('demo'); real.now=ctx.now;
  const jar=new Map();
  const res={getHeader:n=>jar.get(n),setHeader:(n,v)=>jar.set(n,v)};
  const req={headers:{'x-vercel-forwarded-for':'192.0.2.1'}};
  const actor=visitor(real,req,res,{requestId:randomUUID()});
  actor.remember({history:[{role:'user',content:'private visitor topic'}],count:1});
  const cookies=jar.get('Set-Cookie');
  assert.ok(cookies.every(s=>s.includes('HttpOnly') && s.includes('SameSite=Strict') && !s.includes('private visitor')));
  req.headers.cookie=cookies.map(s=>s.split(';')[0]).join('; ');
  const recovered=visitor(real,req,res,{requestId:randomUUID()});
  assert.equal(recovered.sid,actor.sid);assert.equal(recovered.previous.count,1);
  assert.equal(recovered.previous.history[0].content,'private visitor topic');
  assert.equal(real.unseal('ticket',real.seal('context',{sid:'x'})),null);
});

test('session authority is independent of the mail key and scoped by environment', () => {
  const prior = process.env.RESEND_API_KEY;
  try {
    const initial = context('prod');
    const token = initial.seal('callback-summary', { sid: 'fixture' });
    process.env.RESEND_API_KEY = 'rotated-fixture-mail';
    assert.deepEqual(context('prod').unseal('callback-summary', token), { sid: 'fixture' });
    assert.equal(context('prod').sign('cookie/fixture'), initial.sign('cookie/fixture'));
    assert.equal(context('demo').unseal('callback-summary', token), null);
  } finally {
    if (prior === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prior;
  }
});

test('rate keys group IPv6 prefixes and normalize IPv4-mapped IPv6', () => {
  const app = context('demo');
  const ip = value => visitor(app, { headers: { 'x-vercel-forwarded-for': value } },
    { getHeader() {}, setHeader() {} }, { requestId: randomUUID() }).ip;
  assert.equal(ip('2001:db8:0:1::1'), ip('2001:0db8:0000:0001:1234:5678:9abc:def0'));
  assert.notEqual(ip('2001:db8:0:1::1'), ip('2001:db8:0:2::1'));
  assert.equal(ip('::ffff:192.0.2.1'), ip('192.0.2.1'));
});

test('wrong origin, foreign preview and GET requests are refused before provider work', async () => {
  process.env.VERCEL_ENV='production';
  for (const [method,origin,status] of [['GET','https://boomymarketing.com',405],['POST','https://elsewhere.example',403]]) {
    const res={setHeader(){},status(s){this.code=s;return this;},json(v){return v;}};
    await handler('chat')({method,headers:{origin}},res);
    assert.equal(res.code,status);
  }
});
test('voice ticket is conversation-bound, single use, expires at 45 seconds and fails closed on budget', async () => {
  const {ctx, stats} = fixture(), action = {action:'issue', requestId:randomUUID()};
  const first = await voice(ctx,action);
  await assert.rejects(voice({...ctx,sid:'other'}, {action:'connect',token:first.token,sdp:offer}),{status:403});
  await assert.rejects(voice({...ctx,now:ctx.now+45000},{action:'connect',token:first.token,sdp:offer}),{status:403});
  await assert.rejects(voice({...ctx,limits:{day:voiceReserve-1,month:10e6}},{action:'connect',token:first.token,sdp:offer}),{status:429});
  assert.equal(stats.sessions,0);
});

test('server watchdog receives the deadline before releasing SDP; confirmed closure reconciles exposure', async () => {
  const {ctx, jobs, data, stats} = fixture();
  let deadline; ctx.monitor = (_,due) => {deadline=due;return {ready:Promise.resolve(),done:new Promise(() => {})};};
  const {token}=await voice(ctx,{action:'issue',requestId:randomUUID()});
  const answer=await voice(ctx,{action:'connect',token,sdp:offer});
  assert.equal(answer.maxSeconds,360); assert.equal(deadline,ctx.now+360000);
  await assert.rejects(voice(ctx,{action:'connect',token,sdp:offer}),{status:409});
  await assert.rejects(voice({...ctx,sid:'other'},{action:'stop',callId:answer.callId}),{status:403});
  assert.equal(stats.sessions,1); assert.equal(data.get('spend').totals['2026-11'],voiceReserve);
  ctx.now += 360000; ctx.watch = async () => 360;
  await stopVoice(ctx,answer.callId);
  assert.equal(data.get('spend').totals['2026-11'],300000);
  assert.equal((await ctx.store.read('calls/'+answer.callId)).state,'closed');
});

test('two function instances redeem one voice ticket and a different instance settles it', async () => {
  const { ctx, data, stats } = fixture();
  const cold = { ...ctx, store: new InstanceStore() };
  const { token } = await voice(ctx, { action: 'issue', requestId: randomUUID() });
  const results = await Promise.allSettled([ctx, cold].map(worker => voice(worker, { action: 'connect', token, sdp: offer })));
  const live = results.find(r => r.status === 'fulfilled');
  assert.ok(live);
  assert.equal(results.find(r => r.status === 'rejected').reason.status, 409);
  assert.equal(stats.sessions, 1);
  await recordClose(cold, live.value.callId, 360);
  assert.equal(data.get('spend').totals['2026-11'], 300_000);
  assert.equal(data.get('calls/' + live.value.callId).state, 'closed');
});

test('another worker can repair voice settlement from stored usage after a transient ledger failure', async () => {
  const { ctx, data } = fixture();
  let spendUnavailable = false;
  let watches = 0;
  ctx.controls = {
    read: ctx.store.read,
    update: (key, transition) => {
      if (key === 'spend' && spendUnavailable) throw new AssistantError(503, 'callback_only');
      return ctx.store.update(key, transition);
    },
  };
  ctx.watch = async () => { watches++; assert.equal(watches, 1); return 360; };
  const { token } = await voice(ctx, { action: 'issue', requestId: randomUUID() });
  const { callId } = await voice(ctx, { action: 'connect', token, sdp: offer });
  const stop = { action: 'stop', callId };

  spendUnavailable = true;
  assert.deepEqual(await voice(ctx, stop), { stopped: true });
  const pending = await ctx.controls.read('calls/' + callId);
  assert.equal(pending.state, 'closing');
  assert.equal(pending.charged, 300_000);
  assert.equal(data.get('spend').totals['2026-11'], voiceReserve);

  spendUnavailable = false;
  const cold = { ...ctx, store: new InstanceStore() };
  await assert.rejects(voice({ ...cold, sid: 'other' }, stop), { status: 403 });
  await Promise.all([voice(cold, stop), recordClose(ctx, callId, 361)]);
  await voice(cold, stop);
  assert.equal(watches, 1);
  assert.ok(Object.values(data.get('spend').totals).every(value => value === 300_000));
  const closed = await ctx.controls.read('calls/' + callId);
  assert.equal(closed.state, 'closed');
  assert.equal(closed.seconds, 360);
});

test('a failed control attachment withholds the WebRTC answer and tries to close the created provider call', async()=>{
  const {ctx,stats}=fixture();
  ctx.monitor=()=>({ready:Promise.reject(new Error('attach failed')),done:new Promise(()=>{})});
  const {token}=await voice(ctx,{action:'issue',requestId:randomUUID()});
  await assert.rejects(voice(ctx,{action:'connect',token,sdp:offer}));
  assert.equal(stats.sessions,1);assert.equal(stats.watches,1);
});

test('an explicit provider rejection releases the admission hold; an ambiguous creation retains it',async()=>{
  for(const definitelyRejected of [true,false]){
    const {ctx,data}=fixture();
    ctx.openVoice=async()=>{const error=new Error('upstream');error.creationRejected=definitelyRejected;throw error;};
    const {token}=await voice(ctx,{action:'issue',requestId:randomUUID()});
    await assert.rejects(voice(ctx,{action:'connect',token,sdp:offer}));
    assert.equal(data.get('spend').totals['2026-11'],definitelyRejected?0:voiceReserve);
  }
});

test('confirmed overrun is fully accounted and repeated settlement is idempotent',async()=>{
  const {ctx,data}=fixture();
  await reserve(ctx.store,'voice',1000,ctx.limits,ctx.now,360000);
  await recordClose(ctx,'voice',7400);
  const actual=Math.ceil(7400*50000/60);
  assert.equal(data.get('spend').totals['2026-11'],actual);
  await recordClose(ctx,'voice',7400);
  assert.equal(data.get('spend').totals['2026-11'],actual);
  assert.equal(data.get('calls/voice').overrun,true);
  await assert.rejects(reserve(ctx.controls, 'new', 100, ctx.limits, ctx.now, 0), { code: 'callback_only' });
});

class TestSocket extends EventEmitter {
  readyState=0;
  sent=[];
  open(){this.readyState=1;this.emit('open');}
  send(message){this.sent.push(JSON.parse(message));}
  terminate(){this.readyState=3;this.emit('close');}
}

test('a six-minute call hands supervision to a verified second attachment before the first Hobby function expires',async t=>{
  t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
  const sockets=[];let renewals=0;
  const watcher=monitorVoice('fixture',360000,'fixture',async()=>{renewals++;return true;},null,'primary',()=>{
    const socket=new TestSocket();sockets.push(socket);return socket;
  });
  sockets[0].open();await watcher.ready;
  t.mock.timers.tick(150000);await Promise.resolve();
  assert.equal(renewals,1);
  assert.equal(await watcher.done,null);assert.equal(sockets[0].readyState,3);
  t.mock.timers.tick(90000);assert.equal(sockets[0].sent.length,0);
});

test('failed handoff closes early; a disconnected sideband reattaches and records final usage',async t=>{
  t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
  const sockets=[];
  const watcher=monitorVoice('fixture',360000,'fixture',async()=>false,null,'primary',()=>{
    const socket=new TestSocket();sockets.push(socket);return socket;
  });
  sockets[0].open();await watcher.ready;sockets[0].terminate();
  t.mock.timers.tick(600);assert.equal(sockets.length,2);sockets[1].open();
  t.mock.timers.tick(149400);await Promise.resolve();t.mock.timers.tick(90000);
  assert.deepEqual(sockets[1].sent,[{type:'session.close'}]);
  sockets[1].emit('message',Buffer.from(JSON.stringify({type:'session.closed',usage:{seconds:240}})));
  assert.equal(await watcher.done,240);
});

test('an unattached successor never hangs up a healthy primary session',async t=>{
  t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
  const hangup=t.mock.method(globalThis,'fetch',async()=>({ok:true}));
  const watcher=monitorVoice('fixture',210000,'fixture',null,null,'successor',()=>new TestSocket());
  const rejected=assert.rejects(watcher.ready,/timed out/);t.mock.timers.tick(8000);
  await rejected;await assert.rejects(watcher.done,/timed out/);
  assert.equal(hangup.mock.callCount(),0);
});

test('a delegated result completed during reconnection is sent on the new sideband',async t=>{
  t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
  const sockets=[];let reply;
  const advisor=async(event,send)=>{if(event.type==='session.delegation.created')reply=send;};
  const watcher=monitorVoice('fixture',200000,'fixture',null,advisor,'successor',()=>{
    const socket=new TestSocket();sockets.push(socket);return socket;
  });
  sockets[0].open();await watcher.ready;
  sockets[0].emit('message',JSON.stringify({type:'session.delegation.created'}));
  sockets[0].terminate();reply({type:'session.commentary.append',content:'A scoped answer'});
  t.mock.timers.tick(600);sockets[1].open();
  assert.equal(sockets[1].sent[0].content,'A scoped answer');
  sockets[1].emit('message',JSON.stringify({type:'session.closed',usage:{seconds:21}}));
  assert.equal(await watcher.done,21);assert.equal(sockets[0].sent.length,0);
});

test('snapshot uses existing chat when the browser has no encrypted history or an older turn count',()=>{
  const live={count:2,history:[{role:'user',content:'qualified HVAC calls'}]};
  assert.deepEqual(callbackHistory(null,live),live.history);
  assert.deepEqual(callbackHistory({count:0,history:[]},live),live.history);
  assert.deepEqual(callbackHistory({count:1,history:[{role:'user',content:'old'}]},live),live.history);
});

test('delegated speech uses bounded approved text replies, deduplicates delegation ids and keeps quoted directives as visitor input',async()=>{
  const {ctx,stats}=fixture(),sent=[];
  ctx.reply=async body=>{
    stats.replies++;assert.equal(body.input.at(-1).role,'user');assert.match(body.input.at(-1).content,/qualified leads/);
    assert.ok(body.max_output_tokens<=200);return {reply:'Check booked jobs against each campaign.',charged:120,usage:{}};
  };
  const advisor=voiceAdvice(ctx,'fixture');const send=e=>sent.push(e);
  await advisor({type:'session.input_transcript.delta',delta:'How do I measure qualified leads?'},send);
  const e={type:'session.delegation.created',delegation:{id:'delegation_1',target:'client'}};
  await advisor(e,send,false);assert.equal(stats.replies,0);
  await Promise.all([advisor(e,send),advisor(e,send)]);
  assert.equal(stats.replies,1);assert.equal(sent.length,1);assert.equal(sent[0].delegation_id,e.delegation.id);
});
