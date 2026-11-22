import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { context, visitor, handler } from '../lib/assistant/runtime.mjs';
import { InstanceStore } from '../lib/assistant/instance-store.mjs';
import { chat, lead, deliverLead, voice, stopVoice } from '../lib/assistant/service.mjs';
import { reserve, settle, throttle, voiceReserve } from '../lib/assistant/state.mjs';

function fixture() {
  const data = new Map(), jobs = [], sends = new Set(), stats = { replies: 0, sessions: 0, watches: 0 };
  const store = { async read(key) { return structuredClone(data.get(key) ?? null); },
    async update(key, transition) { const value = transition(structuredClone(data.get(key) ?? null)); data.set(key, value); return structuredClone(value); } };
  process.env.OPENAI_API_KEY = 'fixture-model'; process.env.RESEND_API_KEY = 'fixture-mail';
  const { seal, unseal } = context('demo');
  const ctx = { store, seal, unseal, now: Date.UTC(2026, 10, 30, 23, 59, 59), sid: 'visitor-a', ip: 'client-a',
    limits: { day: 8e6, month: 25e6 }, sign: s => createHash('sha256').update(s).digest('base64url'),
    clock: () => ctx.now, background: () => {}, enqueue: async (job, delay, id) => { jobs.push({ ...job, delay, id }); },
    reply: async () => { stats.replies++; return { reply: 'Проверенный ответ', charged: 321 }; },
    notify: async (record, key) => { sends.add(key); return 'mock-receipt'; },
    openVoice: async () => { stats.sessions++; return { upstream: 'test-upstream', sdp: 'v=0\r\n' }; },
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

test('only the confirmed owner email is a receipt; cold retries reuse the same provider key', async () => {
  const {ctx, sends} = fixture();
  const body = {requestId:randomUUID(),name:'Test',contact:'example@example.com',businessType:'Salon',goal:'Demo',consent:true};
  await assert.rejects(lead(ctx,{...body,consent:false}),{status:400});
  await assert.rejects(lead(ctx,{...body,contact:'a@example.com,b@example.com'}),{status:400});
  const first=await lead(ctx,body);
  const again=await lead({...ctx,store:new InstanceStore()}, {...body,requestId:randomUUID()});
  assert.deepEqual(first,again); assert.equal(sends.size,1);
});

test('inline owner delivery failure is visible and confirmed replay recovers', async () => {
  const {ctx}=fixture();
  const body={requestId:randomUUID(),name:'A',contact:'+1 555 010 0100',businessType:'A',goal:'A',consent:true};
  const keys=[];
  ctx.notify=async (_,key)=>{keys.push(key); throw Error('unknown mail response');};
  await assert.rejects(lead(ctx,body));
  ctx.notify=async (_,key)=>{keys.push(key);return 'accepted';};
  assert.equal((await lead(ctx,body)).status,'received'); assert.equal(new Set(keys).size,1);
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
  let deadline; ctx.watch = (_,due) => {deadline=due;return new Promise(() => {});};
  const {token}=await voice(ctx,{action:'issue',requestId:randomUUID()});
  const answer=await voice(ctx,{action:'connect',token,sdp:offer});
  assert.equal(answer.maxSeconds,120); assert.equal(deadline,ctx.now+120000);
  await assert.rejects(voice(ctx,{action:'connect',token,sdp:offer}),{status:409});
  await assert.rejects(voice({...ctx,sid:'other'},{action:'stop',callId:answer.callId}),{status:403});
  assert.equal(stats.sessions,1); assert.equal(data.get('spend').totals['2026-11'],voiceReserve);
  ctx.now += 120000; ctx.watch = async () => 120;
  await stopVoice(ctx,answer.callId);
  assert.equal(data.get('spend').totals['2026-11'],100000);
  assert.equal((await ctx.store.read('calls/'+answer.callId)).state,'closed');
});
