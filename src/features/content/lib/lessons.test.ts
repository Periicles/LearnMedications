import { describe, expect, it } from "vitest";
import type { Area, DrugClass, Substance } from "@/types/content";
import { buildLessons, splitEvenly } from "./lessons";

const area: Area = { slug: "pain", name: "Douleur", icon: "💊" };

function makeSubstance(slug: string, classSlug: string, tier: 1 | 2 | 3 = 1): Substance {
  return {
    slug,
    name: slug,
    brands: [],
    classSlug,
    hint: "hint",
    tier,
    services: [],
    areaSlug: area.slug,
  };
}

const classes = new Map<string, DrugClass>([
  ["nsaids", { slug: "nsaids", name: "AINS", atc: "M01", summary: "", areaSlug: "pain" }],
]);

describe("splitEvenly", () => {
  it("balances chunks instead of leaving a tiny last one", () => {
    const sizes = splitEvenly([1, 2, 3, 4, 5, 6]).map((chunk) => chunk.length);
    expect(sizes).toEqual([3, 3]);
  });

  it("returns no chunk for an empty list", () => {
    expect(splitEvenly([])).toEqual([]);
  });
});

describe("buildLessons", () => {
  it("creates one titled lesson per class and orders by tier", () => {
    const substances = [
      makeSubstance("naproxen", "nsaids", 2),
      makeSubstance("ibuprofen", "nsaids", 1),
      makeSubstance("ketoprofen", "nsaids", 1),
    ];
    const lessons = buildLessons(substances, [area], classes);
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe("AINS");
    expect(lessons[0].key).toBe("ibuprofen");
    expect(lessons[0].substanceSlugs.at(-1)).toBe("naproxen");
  });

  it("merges small classes into a mixed lesson", () => {
    const substances = [makeSubstance("nefopam", "others"), makeSubstance("naloxone", "antidotes")];
    const lessons = buildLessons(substances, [area], classes);
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe("others · antidotes");
  });
});
