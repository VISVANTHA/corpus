import assert from "assert";
import { authorize } from "../src/auth.js";

describe("auth", function () {
  it("blocks viewer writes", function () {
    const result = authorize({ role: "viewer" }, "write");
    assert.strictEqual(result.ok, false);
  });
  it("allows member writes", function () {
    const result = authorize({ role: "member" }, "write");
    assert.strictEqual(result.ok, true);
  });
});
