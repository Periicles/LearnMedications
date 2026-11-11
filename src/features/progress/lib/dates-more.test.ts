import { describe, expect, it } from "vitest";
import { addDays, shiftDay } from "./dates";
import { levelProgress } from "./levels";
import { applyRecords, isMastered, pickDue, updateMastery } from "./mastery";
import { isActiveToday, nextStreak } from "./streak";

describe("remaining progress helpers", () => {
  it("shifts dates forward", () => {
    expect(shiftDay("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays(new Date("2026-11-11T00:00:00Z"), 2).toISOString()).toBe(
      "2026-11-13T00:00:00.000Z",
    );
  });

  it("keeps a streak of at least one for a repeated day", () => {
    expect(nextStreak({ currentStreak: 0, lastActiveOn: "2026-11-11" }, "2026-11-11")).toBe(1);
    expect(isActiveToday({ currentStreak: 1, lastActiveOn: "2026-11-11" }, "2026-11-11")).toBe(
      true,
    );
    expect(isActiveToday({ currentStreak: 1, lastActiveOn: null }, "2026-11-11")).toBe(false);
  });

  it("computes level progress from zero", () => {
    expect(levelProgress(0)).toMatchObject({ level: 1, earnedInLevel: 0, ratio: 0 });
  });

  it("tracks mastery of new and known substances", () => {
    const moment = new Date("2026-11-11T00:00:00Z");
    const fresh = updateMastery("morphine", undefined, false, moment);
    expect(fresh).toMatchObject({ strength: 0, correctCount: 0, wrongCount: 1 });
    const [mastered] = applyRecords(
      [{ substanceSlug: "morphine", correct: true }],
      new Map([["morphine", { ...fresh, strength: 3 }]]),
      moment,
    );
    expect(isMastered(mastered)).toBe(true);
    expect(pickDue([mastered], moment, 5)).toEqual([]);
  });
});
