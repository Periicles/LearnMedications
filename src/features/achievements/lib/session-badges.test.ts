import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { outcomeFromRecords } from "@/features/quiz/lib/session";
import type { BadgeContext } from "@/types/progress";
import { findSessionBadges } from "./session-badges";
import { EMPTY_SESSION_STATS } from "./stats";

const [collection] = getCatalog().collections;
const [lesson] = collection.lessons;

function makeContext(overrides: Partial<BadgeContext>): BadgeContext {
  return {
    input: { mode: "learn", collectionSlug: collection.slug, lessonKey: lesson.key, records: [] },
    outcome: outcomeFromRecords([{ substanceSlug: "ibuprofen", correct: true }]),
    totalXp: 16,
    streak: 1,
    completions: new Map(),
    knownMastery: [],
    updatedMastery: [],
    sessions: EMPTY_SESSION_STATS,
    friendCount: 0,
    ownedKeys: [],
    ...overrides,
  };
}

describe("findSessionBadges", () => {
  it("counts the lesson and the perfect session being saved", () => {
    const keys = findSessionBadges(makeContext({})).map((achievement) => achievement.key);
    expect(keys).toEqual(["first-lesson", "perfect-1"]);
  });

  it("does not grant owned achievements again", () => {
    const keys = findSessionBadges(makeContext({ ownedKeys: ["first-lesson", "perfect-1"] }));
    expect(keys).toEqual([]);
  });

  it("counts review sessions and replaced mastery rows once", () => {
    const strong = {
      substanceSlug: "morphine",
      strength: 4,
      correctCount: 4,
      wrongCount: 0,
      nextReviewAt: "",
    };
    const context = makeContext({
      input: { mode: "review", records: [] },
      outcome: outcomeFromRecords([{ substanceSlug: "morphine", correct: false }]),
      sessions: { ...EMPTY_SESSION_STATS, reviewCount: 9 },
      knownMastery: [strong],
      updatedMastery: [{ ...strong, strength: 1 }],
    });
    expect(findSessionBadges(context).map((achievement) => achievement.key)).toEqual(["review-10"]);
  });
});
