import { AssistantError } from './state.mjs';

// Pilot policy: no hosted store. State and rate windows belong to this warm function instance.
export class InstanceStore {
  constructor() { this.records = new Map(); }
  read(key) {
    const entry = this.records.get(key);
    if (entry && entry.expires > Date.now()) return structuredClone(entry.value);
    this.records.delete(key);
    return null;
  }
  update(key, transition) {
    const now = Date.now();
    const next = transition(this.read(key));
    if (next == null) return next;
    if (!this.records.has(key) && this.records.size >= 4096) {
      for (const [name, record] of this.records) if (record.expires <= now) this.records.delete(name);
      if (this.records.size >= 4096) throw new AssistantError(429, 'limit');
    }
    const ttl = key === 'spend' ? 32 * 86_400_000 : key.startsWith('tickets/') ? 60_000 : 3_600_000;
    this.records.set(key, { value: structuredClone(next), expires: now + ttl });
    return next;
  }
}
