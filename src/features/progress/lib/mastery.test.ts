import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { CompletionMap, Mastery } from "@/types/progress";
import { applyRecords, groupRecords, pickDue, updateMastery } from "./mastery";
import { buildLessonNodes, isLessonUnlocked, summarizeCollection } from "./path";

const moment = new Date("2026-11-11T10:00:00Z");

function makeMastery(substanceSlug: string, strength: number, nextReviewAt: string): Mastery {
  return { substanceSlug, strength, correctCount: 0, wrongCount: 0, nextReviewAt };
}

describe("mastery", () => {
  it("fails a substance when any of its answers is wrong", () => {
    const grouped = groupRecords([
      { substanceSlug: "morphine", correct: true },
      { substanceSlug: "morphine", correct: false },
      { substanceSlug: "codeine", correct: true },
    ]);
    expect(grouped.get("morphine")).toBe(false);
    expect(grouped.get("codeine")).toBe(true);
  });

  it("strengthens on success and schedules a later review", () => {
    const updated = updateMastery("morphine", makeMastery("morphine", 2, ""), true, moment);
    expect(updated.strength).toBe(3);
    expect(updated.nextReviewAt).toBe("2026-11-15T10:00:00.000Z");
  });

  it("drops to a weak strength on failure and caps at the maximum", () => {
    expect(updateMastery("morphine", makeMastery("morphine", 4, ""), false, moment).strength).toBe(
      1,
    );
    expect(updateMastery("morphine", makeMastery("morphine", 5, ""), true, moment).strength).toBe(
      5,
    );
    expect(updateMastery("morphine", undefined, false, moment).strength).toBe(0);
  });

  it("creates rows for new substances", () => {
    const rows = applyRecords([{ substanceSlug: "codeine", correct: true }], new Map(), moment);
    expect(rows).toMatchObject([{ substanceSlug: "codeine", strength: 1, correctCount: 1 }]);
  });

  it("returns due substances weakest first", () => {
    const dueRows = pickDue(
      [
        makeMastery("later", 1, "2026-12-01T00:00:00Z"),
        makeMastery("strong", 3, "2026-11-01T00:00:00Z"),
        makeMastery("weak", 1, "2026-11-10T00:00:00Z"),
      ],
      moment,
      5,
    );
    expect(dueRows.map((mastery) => mastery.substanceSlug)).toEqual(["weak", "strong"]);
  });
});

describe("learning path", () => {
  const catalog = getCatalog();
  const [collection] = catalog.collections;
  const [first, second] = collection.lessons;

  it("unlocks lessons one after another", () => {
    const completions: CompletionMap = new Map([[collection.slug, new Set([first.key])]]);
    const nodes = buildLessonNodes(collection, completions, catalog.areas);
    expect(nodes.slice(0, 3).map((node) => node.status)).toEqual([
      "completed",
      "current",
      "locked",
    ]);
    expect(isLessonUnlocked(collection, second.key, completions)).toBe(true);
    expect(isLessonUnlocked(collection, collection.lessons[2].key, completions)).toBe(false);
  });

  it("summarises collection progress", () => {
    const summary = summarizeCollection(collection, new Map());
    expect(summary.completedCount).toBe(0);
    expect(summary.nextLesson).toBe(first);
  });
});
