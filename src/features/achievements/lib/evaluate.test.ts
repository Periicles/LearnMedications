import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { AchievementStats } from "@/types/achievements";
import type { CompletionMap, Mastery } from "@/types/progress";
import { ACHIEVEMENTS } from "../catalog";
import { buildAchievementViews, findNewAchievements } from "./evaluate";
import { buildAchievementStats, countFinishedPaths, EMPTY_SESSION_STATS } from "./stats";

const baseStats: AchievementStats = {
  totalXp: 0,
  level: 1,
  streak: 0,
  lessonCount: 0,
  perfectCount: 0,
  reviewCount: 0,
  learnedCount: 0,
  masteredCount: 0,
  finishedPaths: 0,
  friendCount: 0,
};

describe("achievement catalog", () => {
  it("uses unique keys", () => {
    const keys = ACHIEVEMENTS.map((achievement) => achievement.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("findNewAchievements", () => {
  it("unlocks reached thresholds only once", () => {
    const stats = { ...baseStats, lessonCount: 1, perfectCount: 1, totalXp: 120, level: 2 };
    const unlocked = findNewAchievements(stats, ["first-lesson"]).map(
      (achievement) => achievement.key,
    );
    expect(unlocked).toEqual(["perfect-1", "xp-100"]);
  });

  it("returns nothing for a newcomer", () => {
    expect(findNewAchievements(baseStats, [])).toEqual([]);
  });
});

describe("buildAchievementViews", () => {
  it("caps progress at the threshold and exposes unlock dates", () => {
    const views = buildAchievementViews(
      { ...baseStats, streak: 12 },
      new Map([["streak-3", "2026-11-11T00:00:00Z"]]),
    );
    const streakView = views.find((view) => view.achievement.key === "streak-3");
    expect(streakView).toMatchObject({ current: 3, unlockedAt: "2026-11-11T00:00:00Z" });
  });
});

describe("buildAchievementStats", () => {
  const catalog = getCatalog();
  const smallest = [...catalog.collections].sort(
    (left, right) => left.lessons.length - right.lessons.length,
  )[0];

  it("derives counters from progress data", () => {
    const completions: CompletionMap = new Map([
      [smallest.slug, new Set(smallest.lessons.map((lesson) => lesson.key))],
    ]);
    const mastery: Mastery[] = [
      { substanceSlug: "morphine", strength: 4, correctCount: 4, wrongCount: 0, nextReviewAt: "" },
      { substanceSlug: "codeine", strength: 1, correctCount: 1, wrongCount: 2, nextReviewAt: "" },
    ];
    const stats = buildAchievementStats({
      totalXp: 320,
      streak: 2,
      completions,
      mastery,
      sessions: { ...EMPTY_SESSION_STATS, perfectCount: 3 },
      friendCount: 1,
    });
    expect(stats).toMatchObject({
      level: 3,
      lessonCount: smallest.lessons.length,
      learnedCount: 2,
      masteredCount: 1,
      perfectCount: 3,
      friendCount: 1,
    });
    expect(countFinishedPaths(completions)).toBeGreaterThanOrEqual(1);
  });
});
