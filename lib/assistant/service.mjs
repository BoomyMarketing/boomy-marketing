import { randomUUID } from 'node:crypto';
import { AssistantError, field, maxVoiceSeconds, microUsdPerMinute, opaque, requireValue, reserve,
  settle, sha, stopAfterSeconds, throttle, uuidPattern, voiceReserve } from './state.mjs';
import { responseBody, textReserve } from './provider.mjs';
import { callbackFields, callbackHistory } from './callback.mjs';
import { voiceAdvice } from './voice-advice.mjs';

const sessionMs = 3_600_000;
const emptyConversation = () => ({ history: [], turns: {}, busy: null });

export async function chat(ctx, body) {
  const { store, sid, now, limits } = ctx;
  const message = field(body.message, 1200);
  const requestId = field(body.requestId, 36);
  requireValue(uuidPattern.test(requestId));
  const turnKey = sha(sid + '/' + requestId);
  const path = 'chat/' + sid;
  const current = await store.read(path);
  const was = current?.turns[requestId];
  if (was?.answer && was.hash === sha(message)) return { reply: was.answer };
  await throttle(store, ctx.ip, 'chat', 20, 600_000, now);
  const claim = opaque();
  const state = await store.update(path, old => {
    const s = !old || old.expires <= now ? { ...emptyConversation(), history: ctx.previous?.history || [],
      count: ctx.previous?.count || 0 } : old;
    if (s.turns[requestId]?.answer && s.turns[requestId].hash === sha(message)) return s;
    requireValue(!s.turns[requestId] && (!s.busy || s.busy.until <= now), 409, 'conflict');
    requireValue(Math.max(s.count || 0,ctx.previous?.count || 0) < 20 && Object.keys(s.turns).length < 20, 429, 'limit');
    s.turns[requestId] = { hash: sha(message), claim };
    s.busy = { claim, until: now + 65_000 };
    s.expires = now + sessionMs;
    return s;
  });
  if (state.turns[requestId].answer) return { reply: state.turns[requestId].answer };
  const request = responseBody(state.history, message);
  let paid = false;
  try {
    await reserve(store, turnKey, textReserve(request), limits, now, 60_000);
    paid = true;
    const result = await ctx.reply(request);
    const reply = result.reply;
    const complete = await store.update(path, s => {
      requireValue(s?.busy?.claim === claim, 409, 'conflict');
      s.turns[requestId].answer = reply;
      s.history = [...s.history, { role: 'user', content: message }, { role: 'assistant', content: reply }].slice(-8);
      s.count = Math.max(s.count || 0,ctx.previous?.count || 0) + 1;
      s.busy = null;
      return s;
    });
    ctx.remember?.({ history: complete.history.slice(-4).map(row => ({ role: row.role, content: row.content.slice(0,220) })), count: complete.count });
    await settle(store, turnKey, result.charged);
    return { reply };
  } catch (error) {
    await store.update(path, s => {
      if (s?.busy?.claim === claim) {
        s.busy = null;
        if (!paid) delete s.turns[requestId];
      }
      return s;
    });
    throw error;
  }
}

export async function lead(ctx, body) {
  requireValue(uuidPattern.test(body.requestId || ''));
  const fields = callbackFields(body,ctx.now);
  const fingerprint = sha(JSON.stringify([fields.name.toLowerCase(),fields.phone,fields.email,fields.businessType.toLowerCase(),
    fields.serviceInterest.toLowerCase(),fields.goal,fields.windowId,fields.location,fields.budget,fields.timeline]));
  const ref = sha(ctx.sign('callback/' + fingerprint));
  const path = 'leads/' + ref;
  const prior = await ctx.store.read(path);
  if (prior) {
    requireValue(prior.fingerprint === fingerprint, 409, 'conflict');
    await deliverLead(ctx,ref);
    return { status: 'received', reference: prior.reference, window: prior.windowLabel };
  }
  await throttle(ctx.store, ctx.ip, 'lead', 3, sessionMs, ctx.now);
  await throttle(ctx.store, 'owner', 'callbacks', 12, 600_000, ctx.now);
  const chatState = await ctx.store.read('chat/' + ctx.sid);
  const snapshot = body.summaryToken ? ctx.unseal('callback-summary',body.summaryToken) : null;
  if (body.summaryToken) requireValue(snapshot?.sid === ctx.sid && snapshot.expires > ctx.now && Array.isArray(snapshot.history));
  const topics = (snapshot?.history || callbackHistory(ctx.previous,chatState)).slice(-4)
    .map(turn => (turn.role === 'user' ? 'Visitor: ' : 'Boomy: ') + turn.content.slice(0,220));
  // The provider keeps the accepted owner email. The same confirmed request uses one provider idempotency key.
  const saved = await ctx.store.update(path, existing => {
    if (existing) { requireValue(existing.fingerprint === fingerprint, 409, 'conflict'); return existing; }
    return { ...fields, fingerprint, topics, reference: 'BM-' + ref.slice(0, 12).toUpperCase(),
      created: ctx.now, state: 'received' };
  });
  await deliverLead(ctx,ref);
  return { status: 'received', reference: saved.reference, window: saved.windowLabel };
}

export async function deliverLead(ctx, ref) {
  const path = 'leads/' + ref;
  const lead = await ctx.store.read(path);
  requireValue(lead, 503, 'unavailable');
  if (lead.state === 'sent') return;
  requireValue(lead.state !== 'needs-reconciliation',503,'unavailable');
  if (ctx.now - lead.created >= 22 * sessionMs) {
    await ctx.store.update(path, s => ({ ...s, state: s.state === 'sent' ? 'sent' : 'needs-reconciliation' }));
    throw new AssistantError(503,'unavailable');
  }
  // Stable payload and idempotency key cover concurrent workers and lost acknowledgements.
  const receipt = await ctx.notify(lead, 'boomy-chat-' + ref);
  await ctx.store.update(path, s => ({ ...s, state: 'sent', mailReceipt: receipt }));
}

export async function voice(ctx, body) {
  const { store, sid, now } = ctx;
  if (body.action === 'issue') {
    requireValue(uuidPattern.test(body.requestId || ''));
    await throttle(store, ctx.ip, 'voice', 4, sessionMs, now);
    const claim = { sid, ip: ctx.ip, expires: now + 45_000, callId: randomUUID(), used: false };
    const token = ctx.seal('ticket',claim);
    const ticket = await store.update('tickets/' + sha(token), old => old || claim);
    requireValue(ticket.expires > now && !ticket.used, 409, 'conflict');
    return { token, expiresIn: Math.ceil((ticket.expires - now) / 1000), maxSeconds: stopAfterSeconds };
  }
  if (body.action === 'stop') {
    requireValue(uuidPattern.test(body.callId || ''));
    const path = 'calls/' + body.callId;
    let call = await store.read(path);
    if (!call && ctx.lastCall?.ref === body.callId && ctx.lastCall.sid === sid) {
      call = await store.update(path, old => old || ctx.lastCall);
    }
    requireValue(call?.sid === sid, 403, 'denied');
    await stopVoice(ctx, body.callId, true);
    return { stopped: true };
  }
  requireValue(body.action === 'connect' && typeof body.token === 'string' && body.token.length < 800);
  const sdp = field(body.sdp, 48_000);
  requireValue(sdp.startsWith('v=0') && /^m=audio /m.test(sdp) && !/^m=video /m.test(sdp));
  const envelope = ctx.unseal('ticket',body.token);
  const ticket = await store.update('tickets/' + sha(body.token), saved => {
    const item = saved || envelope;
    requireValue(item?.sid === sid && item.ip === ctx.ip && item.expires > now, 403, 'denied');
    requireValue(!item.used, 409, 'conflict');
    return { ...item, used: true };
  });
  const ref = ticket.callId;
  const path = 'calls/' + ref;
  const deadline = now + stopAfterSeconds * 1000;
  const history = (await store.read('chat/' + sid))?.history || ctx.previous?.history || [];
  await reserve(store, ref, voiceReserve, ctx.limits, now, maxVoiceSeconds * 1000);
  try {
    await store.update(path, () => ({ sid, deadline, state: 'creating' }));
  } catch (error) { await settle(store, ref, 0); throw error; }
  let connection;
  try {
    connection = await ctx.openVoice(sdp + '\r\n', history);
  } catch (error) {
    if (error.creationRejected === true) await settle(store,ref,0);
    throw error;
  }
  try {
    const call = await store.update(path, item => ({ ...item, ref, upstream: connection.upstream, state: 'open' }));
    ctx.rememberCall?.(call);
    requireValue(ctx.clock() < deadline, 503, 'unavailable');
    const advisor = voiceAdvice(ctx,ref);
    const handoff = () => ctx.handoff(ctx.seal('server-sideband',{
      ref,sid,upstream:connection.upstream,deadline,history:advisor.snapshot(),
    }));
    const watcher = ctx.monitor(connection.upstream,deadline,handoff,advisor);
    ctx.background(watcher.done.then(usage => usage === null ? undefined : recordClose(ctx,ref,usage)));
    await watcher.ready;
    return { callId: ref, sdp: connection.sdp, maxSeconds: Math.max(1, Math.ceil((deadline - ctx.clock()) / 1000)) };
  } catch (error) {
    try { await recordClose(ctx, ref, await ctx.watch(connection.upstream, ctx.clock())); } catch { /* Hold the full reservation. */ }
    throw error;
  }
}

export async function recordClose(ctx, ref, seconds) {
  requireValue(Number.isFinite(seconds) && seconds >= 0 && Number.isSafeInteger(Math.ceil(seconds) * microUsdPerMinute), 503, 'unavailable');
  // WebRTC initialization carries a 15-second minimum at the active rate.
  const charged = Math.ceil(Math.max(15, Math.ceil(seconds)) * microUsdPerMinute / 60);
  await ctx.store.update('calls/' + ref, item => ({ ...item, state: 'closed', seconds, charged, overrun: seconds > stopAfterSeconds + 15 }));
  await settle(ctx.store, ref, charged);
}

export async function stopVoice(ctx, ref, requested = false) {
  const call = await ctx.store.read('calls/' + ref);
  if (call?.state === 'closed') { await settle(ctx.store, ref, call.charged); return; }
  requireValue(call?.upstream, 503, 'unavailable');
  requireValue(requested || ctx.clock() >= call.deadline, 503, 'unavailable');
  await recordClose(ctx, ref, await ctx.watch(call.upstream, ctx.clock()));
}
