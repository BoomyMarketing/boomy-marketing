import { randomUUID } from 'node:crypto';
import { admitPaid, AssistantError, field, maxVoiceSeconds, microUsdPerMinute, opaque, requireValue,
  settle, sha, stopAfterSeconds, throttle, uuidPattern, voiceReserve } from './state.mjs';
import { responseBody, textReserve } from './provider.mjs';
import { callbackFields, callbackHistory } from './callback.mjs';
import { voiceAdvice } from './voice-advice.mjs';

const sessionMs = 3_600_000;
const emptyConversation = () => ({ history: [], turns: {}, busy: null });

export async function chat(ctx, body) {
  const { store, controls, sid, now } = ctx;
  const message = field(body.message, 1200);
  const requestId = field(body.requestId, 36);
  requireValue(uuidPattern.test(requestId));
  const turnKey = sha(sid + '/' + requestId);
  const path = 'chat/' + sid;
  const current = await store.read(path);
  const was = current?.turns[requestId];
  if (was?.answer && was.hash === sha(message)) return { reply: was.answer };
  await throttle(controls, ctx.ip, 'chat', 20, 600_000, now);
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
    await admitPaid(ctx, turnKey, textReserve(request), 60_000);
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
    // An unavailable store leaves the full reservation in place. The answer is already saved locally.
    await settle(controls, turnKey, result.charged).catch(() => {});
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

async function throttleCallback(ctx, key, kind, maximum, window) {
  await throttle(ctx.store, key, kind, maximum, window, ctx.now);
  if (ctx.controls === ctx.store) return;
  try {
    await throttle(ctx.controls, key, kind, maximum, window, ctx.now);
  } catch (error) {
    if (error.code !== 'callback_only') throw error;
  }
}

export async function lead(ctx, body) {
  requireValue(uuidPattern.test(body.requestId || ''));
  const fields = callbackFields(body,ctx.now);
  const fingerprint = sha(JSON.stringify([fields.name.toLowerCase(),fields.phone,fields.email,fields.businessType.toLowerCase(),
    fields.serviceInterest.toLowerCase(),fields.goal,fields.windowId,fields.location,fields.budget,fields.timeline]));
  const ref = ctx.callbackReference(fingerprint);
  const path = 'leads/' + ref;
  const prior = await ctx.store.read(path);
  if (prior) {
    requireValue(prior.fingerprint === fingerprint, 409, 'conflict');
    await deliverLead(ctx,ref);
    return { status: 'received', reference: prior.reference, window: prior.windowLabel };
  }
  await throttleCallback(ctx, ctx.ip, 'lead', 3, sessionMs);
  await throttleCallback(ctx, 'owner', 'callbacks', 12, 600_000);
  const chatState = await ctx.store.read('chat/' + ctx.sid);
  const snapshot = body.summaryToken ? ctx.unseal('callback-summary',body.summaryToken) : null;
  if (body.summaryToken) requireValue(snapshot?.sid === ctx.sid && snapshot.expires > ctx.now && Array.isArray(snapshot.history));
  const topics = (snapshot?.history || callbackHistory(ctx.previous,chatState)).slice(-4)
    .map(turn => (turn.role === 'user' ? 'Visitor: ' : 'AI assistant (unverified): ') + turn.content.slice(0,220));
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
  const { store, controls, sid, now } = ctx;
  if (body.action === 'issue') {
    requireValue(uuidPattern.test(body.requestId || ''));
    await throttle(controls, ctx.ip, 'voice', 4, sessionMs, now);
    const claim = { sid, ip: ctx.ip, expires: now + 45_000, callId: randomUUID(), used: false };
    const token = ctx.seal('ticket',claim);
    const ticket = await controls.update('tickets/' + sha(token), old => old || claim);
    requireValue(ticket.expires > now && !ticket.used, 409, 'conflict');
    return { token, expiresIn: Math.ceil((ticket.expires - now) / 1000), maxSeconds: stopAfterSeconds };
  }
  if (body.action === 'stop') {
    requireValue(uuidPattern.test(body.callId || ''));
    await stopVoice(ctx, body.callId, true);
    return { stopped: true };
  }
  requireValue(body.action === 'connect' && typeof body.token === 'string' && body.token.length < 800);
  const sdp = field(body.sdp, 48_000);
  requireValue(sdp.startsWith('v=0') && /^m=audio /m.test(sdp) && !/^m=video /m.test(sdp));
  const envelope = ctx.unseal('ticket',body.token);
  requireValue(envelope?.sid === sid && envelope.ip === ctx.ip && envelope.expires > now, 403, 'denied');
  await throttle(controls, ctx.ip, 'voice-connect', 4, sessionMs, now);
  const ticket = await controls.update('tickets/' + sha(body.token), (saved, storeNow = now) => {
    requireValue(saved?.callId === envelope.callId && saved.expires > storeNow, 403, 'denied');
    requireValue(!saved.used, 409, 'conflict');
    return { ...saved, used: true };
  });
  const ref = ticket.callId;
  const path = 'calls/' + ref;
  const deadline = now + stopAfterSeconds * 1000;
  const history = (await store.read('chat/' + sid))?.history || ctx.previous?.history || [];
  await admitPaid(ctx, ref, voiceReserve, maxVoiceSeconds * 1000);
  let connection;
  try {
    connection = await ctx.openVoice(sdp + '\r\n', history);
  } catch (error) {
    if (error.creationRejected === true) await settle(controls,ref,0);
    throw error;
  }
  try {
    const call = await controls.update(path, () => ({ ref, sid, deadline, upstream: connection.upstream, state: 'open' }));
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
  const call = await ctx.controls.update('calls/' + ref, item => {
    if (item?.state === 'closing' || item?.state === 'closed') return item;
    return { ...item, state: 'closing', seconds, charged, overrun: seconds > stopAfterSeconds + 15 };
  });
  await reconcileVoiceCharge(ctx.controls, ref, call);
}

async function reconcileVoiceCharge(controls, ref, call) {
  await settle(controls, ref, call.charged);
  if (call.state === 'closing') {
    await controls.update('calls/' + ref, item => item?.state === 'closing' && item.charged === call.charged
      ? { ...item, state: 'closed' } : null);
  }
}

export async function stopVoice(ctx, ref, requested = false) {
  const stored = await ctx.controls.read('calls/' + ref).catch(() => null);
  const call = stored || (ctx.lastCall?.ref === ref ? ctx.lastCall : null);
  requireValue(!requested || call?.sid === ctx.sid, 403, 'denied');
  if (call?.state === 'closing' || call?.state === 'closed') {
    await reconcileVoiceCharge(ctx.controls, ref, call).catch(() => {});
    return;
  }
  requireValue(call?.upstream, 503, 'unavailable');
  requireValue(requested || ctx.clock() >= call.deadline, 503, 'unavailable');
  const seconds = await ctx.watch(call.upstream, ctx.clock());
  await recordClose(ctx, ref, seconds).catch(() => {});
}
