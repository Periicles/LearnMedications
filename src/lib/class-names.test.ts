import { describe, expect, it } from "vitest";
import { mergeClasses } from "./class-names";

describe("mergeClasses", () => {
  it("joins truthy class names", () => {
    expect(mergeClasses("card", false, undefined, "active")).toBe("card active");
  });
});
