import { createHash, randomBytes } from 'node:crypto';

export const sha = value => createHash('sha256').update(value).digest('hex');
export const opaque = () => randomBytes(32).toString('base64url');
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const stopAfterSeconds = 360;
export const maxVoiceSeconds = 7380; // Includes signaling allowance and two hours of connected audio.
export const microUsdPerMinute = 50_000;
export const voiceReserve = Math.ceil(maxVoiceSeconds * microUsdPerMinute / 60);
const settledHoldLifetimeMs = 3 * 3_600_000; // Covers the longest live call and its finalization window.

const messages = {
  invalid: 'Check the details and try again.',
  window: 'That callback window is no longer available. Choose another time.',
  denied: 'Open the assistant on the Boomy Marketing website.',
  conflict: 'This request is already being processed. Check its status in a moment.',
  limit: 'This chat has reached its limit. You can still request a callback.',
  callback_only: 'Text and voice are temporarily unavailable. You can still request a callback.',
  unavailable: 'We could not complete that request. You can reach Boomy at care@boomymarketing.com.',
};

export class AssistantError extends Error {
  constructor(status, code) {
    super(messages[code]);
    this.status = status;
    this.code = code;
  }
}

export function requireValue(ok, status = 400, code = 'invalid') {
  if (!ok) throw new AssistantError(status, code);
}

export function field(input, max) {
  requireValue(typeof input === 'string');
  const value = input.trim();
  requireValue(value.length > 0 && value.length <= max && !/[\0-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value));
  return value;
}

function periods(time, horizonMs) {
  const start = new Date(time).toISOString();
  const end = new Date(time + horizonMs).toISOString();
  return [...new Set([start.slice(0, 10), end.slice(0, 10), start.slice(0, 7), end.slice(0, 7)])];
}

export async function reserve(store, id, amount, limits, now, horizonMs) {
  requireValue(Number.isSafeInteger(amount) && amount > 0, 503, 'callback_only');
  await store.update('spend', (state, storeNow = now) => {
    state ??= { totals: {}, holds: {} };
    requireValue(state.totals && state.holds && typeof state.totals === 'object' &&
      typeof state.holds === 'object' && !Array.isArray(state.totals) && !Array.isArray(state.holds), 503, 'callback_only');
    requireValue(!state.frozen, 503, 'callback_only');
    const keys = periods(storeNow, horizonMs);
    // Once all affected periods are historical, their counters can no longer admit usage.
    const thisMonth = keys[0].slice(0, 7);
    for (const key of Object.keys(state.totals)) {
      if (key.slice(0, 7) < thisMonth) delete state.totals[key];
    }
    for (const [oldId, hold] of Object.entries(state.holds)) {
      const expiredSettlement = hold.settled && Number.isSafeInteger(hold.settledAt) &&
        storeNow - hold.settledAt >= settledHoldLifetimeMs;
      if (expiredSettlement || hold.keys.every(key => key.slice(0, 7) < thisMonth)) delete state.holds[oldId];
    }
    requireValue(!Object.hasOwn(state.holds, id), 409, 'conflict');
    for (const key of keys) {
      const limit = key.length === 10 ? limits.day : limits.month;
      const used = Object.hasOwn(state.totals, key) ? state.totals[key] : 0;
      requireValue(Number.isSafeInteger(used) && used >= 0, 503, 'callback_only');
      requireValue(used + amount <= limit, 429, 'callback_only');
    }
    for (const key of keys) state.totals[key] = (state.totals[key] || 0) + amount;
    state.holds[id] = { keys, amount };
    return state;
  });
}

export async function admitPaid(ctx, id, amount, horizonMs) {
  requireValue(ctx.controls, 503, 'callback_only');
  const start = performance.now();
  // Allow for the time between the database clock reading and dispatch to OpenAI.
  await reserve(ctx.controls, id, amount, ctx.limits, ctx.clock(), horizonMs + 8000);
  requireValue(performance.now() - start < 5000, 503, 'callback_only');
}

export async function settle(store, id, actual) {
  await store.update('spend', (state, storeNow = Date.now()) => {
    const hold = state?.holds?.[id];
    if (!hold || hold.settled) return null;
    requireValue(Number.isSafeInteger(actual) && actual >= 0, 503, 'unavailable');
    if (actual > hold.amount) state.frozen = true;
    for (const key of hold.keys) {
      if (Object.hasOwn(state.totals, key)) state.totals[key] -= hold.amount - actual;
    }
    hold.settled = true;
    hold.settledAt = storeNow;
    return state;
  });
}

export async function throttle(store, ipHash, kind, maximum, periodMs, now) {
  await store.update('rate/' + ipHash + '/' + kind, (current, storeNow = now) => {
    const recent = (current || []).filter(t => t > storeNow - periodMs);
    requireValue(recent.length < maximum, 429, 'limit');
    return [...recent, storeNow];
  });
}
