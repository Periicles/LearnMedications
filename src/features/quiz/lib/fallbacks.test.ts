import { describe, expect, it } from "vitest";
import { makeCatalog, makeDrugClass, makeSubstance } from "@/testing/quiz-fixtures";
import { brandDistractors, classDistractors, outsiderDistractors } from "./distractors";
import { describeFact, buildChoice, buildMatch, availableKinds } from "./exercises";
import { buildLessonPlan } from "./plan";
import { seededRandom } from "./random";

const target = makeSubstance({ brands: ["Shared", "Own"] });
const twin = makeSubstance({ slug: "twin", name: "Twinmol", brands: ["Shared", "Other"] });
const loner = makeSubstance({ slug: "loner", name: "Lonermol", brands: [], classSlug: "class-b" });
const catalog = makeCatalog([target, twin, loner], [makeDrugClass()]);

describe("distractors", () => {
  it("never proposes a brand of the target even when another substance shares it", () => {
    const brands = brandDistractors(target, catalog, seededRandom(1));
    expect(brands).not.toContain("Shared");
    expect(brands).not.toContain("Own");
    expect(brands).toEqual(["Other"]);
  });

  it("returns fewer distractors when the catalog is too small", () => {
    expect(classDistractors(target, catalog, seededRandom(1))).toEqual([]);
    expect(outsiderDistractors(target, catalog, seededRandom(1))).toEqual(["Lonermol"]);
  });
});

describe("exercises with missing data", () => {
  it("falls back to the class slug when the class is unknown", () => {
    expect(describeFact(loner, catalog)).toBe("Lonermol · class-b");
    expect(describeFact(target, catalog)).toBe("Alphamol (Shared, Own) · Classe A");
  });

  it("only offers family questions for unbranded substances", () => {
    expect(availableKinds(loner)).toEqual(["substance-to-class", "class-to-substance"]);
    const choice = buildChoice("substance-to-class", loner, catalog, seededRandom(2));
    expect(choice.answer).toBe("class-b");
  });

  it("matches substances to their hint when one has no brand", () => {
    const match = buildMatch([target, loner], catalog, seededRandom(2));
    expect(match.pairs.map((pair) => pair.right)).toEqual([target.hint, loner.hint]);
    expect(match.id).toBe("match-pairs:alpha+loner");
  });
});

describe("buildLessonPlan with an unknown class", () => {
  it("uses the class slug and an empty summary on intro cards", () => {
    const plan = buildLessonPlan("Titre", [loner], catalog, "learn", seededRandom(3));
    expect(plan.cards[0]).toMatchObject({ className: "class-b", classSummary: "" });
    expect(plan.exercises.every((exercise) => exercise.kind !== "match-pairs")).toBe(true);
  });

  it("has no cards in review mode", () => {
    const plan = buildLessonPlan(
      "Titre",
      [target, twin, loner],
      catalog,
      "review",
      seededRandom(3),
    );
    expect(plan.cards).toEqual([]);
    expect(plan.exercises.length).toBeGreaterThan(0);
  });
});
