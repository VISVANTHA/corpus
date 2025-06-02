import { evaluatePolicy, canTransition } from "./policy.js";
import { ok, err } from "./result.js";
import { toProductId } from "./ids.js";
function createService(store) {
  return {
    upsert(raw, role) {
      const id = toProductId(raw.id);
      const record = Object.assign({}, raw, { id });
      const decision = evaluatePolicy(record, role);
      if (!decision.ok) return err(decision.reasons);
      return ok(store.put(record));
    },
    move(id, to, role) {
      const current = store.get(id);
      if (!current) return err(["missing"]);
      if (!canTransition(current.status, to)) return err(["illegal-transition"]);
      current.status = to;
      const decision = evaluatePolicy(current, role);
      if (!decision.ok) return err(decision.reasons);
      return ok(store.put(current));
    },
    all() {
      return store.list();
    },
  };
}

export { createService };
