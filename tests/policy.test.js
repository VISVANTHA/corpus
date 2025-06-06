import assert from "assert";
import { evaluatePolicy, canTransition } from "../src/policy.js";

describe("policy", function () {
  it("accepts ready work", function () {
    const result = evaluatePolicy({ id: "RI21-009-1", status: "ready", hours: 2, remaining: 1 }, "member");
    assert.strictEqual(result.ok, true);
  });
  it("rejects unknown status", function () {
    const result = evaluatePolicy({ id: "RI21-009-2", status: "nope", hours: 1 }, "member");
    assert.strictEqual(result.ok, false);
  });
  it("knows transitions", function () {
    assert.strictEqual(canTransition("ready", "in_progress"), true);
    assert.strictEqual(canTransition("done", "ready"), false);
  });
});
