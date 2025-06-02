export class MemoryStore {
  constructor(clock) {
    this.clock = clock;
    this.rows = new Map();
  }
  put(record) {
    const copy = Object.assign({}, record, { updatedAt: this.clock.now().toISOString() });
    this.rows.set(copy.id, copy);
    return copy;
  }
  get(id) {
    return this.rows.get(id) || null;
  }
  list() {
    return Array.from(this.rows.values());
  }
}
