import { expect, test } from "bun:test";
import { normalizeName, renderGreeting } from "./names";

test("normalizes a valid name and uses it in the greeting", () => {
  expect(normalizeName("  Ada  ")).toBe("Ada");
  expect(renderGreeting("  Ada  ")).toBe("Hello, Ada.");
});
