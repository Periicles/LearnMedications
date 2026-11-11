import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./navigation";
import { collectionRoute, lessonRoute, ROUTES } from "./routes";

describe("routes", () => {
  it("builds collection and lesson paths", () => {
    expect(collectionRoute("essentials")).toBe("/learn/essentials");
    expect(lessonRoute("essentials", "paracetamol")).toBe("/lesson/essentials/paracetamol");
  });

  it("exposes unique absolute paths", () => {
    const paths = Object.values(ROUTES);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith("/"))).toBe(true);
  });
});

describe("NAV_ITEMS", () => {
  it("points to known routes with labels and icons", () => {
    const known = new Set<string>(Object.values(ROUTES));
    for (const item of NAV_ITEMS) {
      expect(known.has(item.href)).toBe(true);
      expect(item.label).not.toBe("");
      expect(item.icon).toBeDefined();
    }
  });
});
