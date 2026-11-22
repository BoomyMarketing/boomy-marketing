import { createHash, randomBytes } from 'node:crypto';

export const sha = value => createHash('sha256').update(value).digest('hex');
export const opaque = () => randomBytes(32).toString('base64url');
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const stopAfterSeconds = 120;
export const maxVoiceSeconds = 7380; // Includes signaling allowance and two hours of connected audio.
export const microUsdPerMinute = 50_000;
export const voiceReserve = Math.ceil(maxVoiceSeconds * microUsdPerMinute / 60);

const messages = {
  invalid: 'Проверьте данные и попробуйте снова.',
  denied: 'Откройте чат на сайте Boomy Marketing.',
  conflict: 'Этот запрос уже обрабатывается. Проверьте его состояние через несколько секунд.',
  limit: 'Достигнут лимит чата. Вы можете оставить заявку менеджеру.',
  unavailable: 'Сервис временно недоступен. Напишите нам на care@boomymarketing.com.',
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
  const keys = periods(now, horizonMs);
  await store.update('spend', state => {
    state ??= { totals: {}, holds: {} };
    requireValue(!state.holds[id], 409, 'conflict');
    for (const key of keys) {
      const limit = key.length === 10 ? limits.day : limits.month;
      requireValue((state.totals[key] || 0) + amount <= limit, 429, 'limit');
    }
    // Once all affected periods are historical, their counters can no longer admit usage.
    const thisMonth = keys[0].slice(0, 7);
    for (const key of Object.keys(state.totals)) {
      if (key.slice(0, 7) < thisMonth) delete state.totals[key];
    }
    for (const [oldId, hold] of Object.entries(state.holds)) {
      if (hold.keys.every(key => key.slice(0, 7) < thisMonth)) delete state.holds[oldId];
    }
    for (const key of keys) state.totals[key] = (state.totals[key] || 0) + amount;
    state.holds[id] = { keys, amount };
    return state;
  });
}

export async function settle(store, id, actual) {
  await store.update('spend', state => {
    const hold = state?.holds[id];
    if (!hold) return state;
    requireValue(Number.isSafeInteger(actual) && actual >= 0 && actual <= hold.amount, 503, 'unavailable');
    for (const key of hold.keys) {
      if (Object.hasOwn(state.totals, key)) state.totals[key] -= hold.amount - actual;
    }
    delete state.holds[id];
    return state;
  });
}

export async function throttle(store, ipHash, kind, maximum, periodMs, now) {
  await store.update('rate/' + ipHash + '/' + kind, current => {
    const recent = (current || []).filter(t => t > now - periodMs);
    requireValue(recent.length < maximum, 429, 'limit');
    return [...recent, now];
  });
}
