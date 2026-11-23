import { AssistantError } from './state.mjs';

// Conversation, callback and admission state for this warm function instance.
export class InstanceStore {
  constructor() {
    this.records = new Map();
    this.spend = null;
  }
  read(key) {
    if (key === 'spend') return structuredClone(this.spend);
    const entry = this.records.get(key);
    if (entry && entry.expires > Date.now()) return structuredClone(entry.value);
    this.records.delete(key);
    return null;
  }
  update(key, transition) {
    const now = Date.now();
    // Read, transition and commit must stay synchronous in this instance.
    const next = transition(this.read(key), now);
    if (next == null) return next;
    if (key === 'spend') {
      this.spend = structuredClone(next);
      return next;
    }
    if (!this.records.has(key) && this.records.size >= 4096) {
      for (const [name, record] of this.records) if (record.expires <= now) this.records.delete(name);
      if (this.records.size >= 4096) throw new AssistantError(429, 'limit');
    }
    const ttl = 3_600_000;
    this.records.set(key, { value: structuredClone(next), expires: now + ttl });
    return next;
  }
}
