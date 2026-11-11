import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { countFinishedPaths, countLessons } from "./stats";

const [collection] = getCatalog().collections;

describe("achievement stats helpers", () => {
  it("counts lessons across collections", () => {
    expect(countLessons(new Map())).toBe(0);
    expect(
      countLessons(
        new Map([
          ["a", new Set(["x", "y"])],
          ["b", new Set(["z"])],
        ]),
      ),
    ).toBe(3);
  });

  it("only counts paths whose lessons are all completed", () => {
    const partial = new Map([[collection.slug, new Set([collection.lessons[0].key])]]);
    const expected = collection.lessons.length === 1 ? 1 : 0;
    expect(countFinishedPaths(partial)).toBe(expected);
    expect(countFinishedPaths(new Map())).toBe(0);
  });
});
