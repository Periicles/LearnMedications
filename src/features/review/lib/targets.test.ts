import { describe, expect, it } from "vitest";
import type { Mastery } from "@/types/progress";
import { pickReviewTargets } from "./targets";

const moment = new Date("2026-11-11T10:00:00Z");

function makeMastery(substanceSlug: string, strength: number, nextReviewAt: string): Mastery {
  return { substanceSlug, strength, correctCount: 0, wrongCount: 0, nextReviewAt };
}

describe("pickReviewTargets", () => {
  it("prefers due substances", () => {
    const rows = [
      makeMastery("future", 0, "2026-12-01T00:00:00Z"),
      makeMastery("overdue", 3, "2026-11-01T00:00:00Z"),
    ];
    expect(pickReviewTargets(rows, moment)).toEqual(["overdue"]);
  });

  it("falls back to the weakest substances when nothing is due", () => {
    const rows = [
      makeMastery("strong", 5, "2026-12-01T00:00:00Z"),
      makeMastery("weak", 1, "2026-12-01T00:00:00Z"),
    ];
    expect(pickReviewTargets(rows, moment)).toEqual(["weak", "strong"]);
    expect(pickReviewTargets([], moment)).toEqual([]);
  });
});
