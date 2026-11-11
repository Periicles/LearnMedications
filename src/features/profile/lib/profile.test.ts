import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { buildAreaMastery } from "./areas";
import { buildDailySeries } from "./chart";

describe("buildDailySeries", () => {
  it("fills missing days with zero and labels weekdays", () => {
    const series = buildDailySeries("2026-11-11", 3, [{ day: "2026-11-10", xp: 40 }]);
    expect(series).toEqual([
      { day: "2026-11-09", label: "L", xp: 0 },
      { day: "2026-11-10", label: "M", xp: 40 },
      { day: "2026-11-11", label: "M", xp: 0 },
    ]);
  });
});

describe("buildAreaMastery", () => {
  it("counts learned and mastered substances per area", () => {
    const catalog = getCatalog();
    const [first, second] = [...catalog.substances.values()].filter(
      (substance) => substance.areaSlug === "pain",
    );
    const areas = buildAreaMastery(catalog, [
      { substanceSlug: first.slug, strength: 5, correctCount: 5, wrongCount: 0, nextReviewAt: "" },
      { substanceSlug: second.slug, strength: 1, correctCount: 1, wrongCount: 1, nextReviewAt: "" },
    ]);
    const pain = areas.find((area) => area.slug === "pain");
    expect(pain).toMatchObject({ learnedCount: 2, masteredCount: 1 });
    expect(areas).toHaveLength(catalog.areas.length);
  });
});
