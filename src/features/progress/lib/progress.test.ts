import { describe, expect, it } from "vitest";
import type { SessionOutcome } from "@/types/quiz";
import { lastDays, shiftDay, toLocalDay } from "./dates";
import { levelFromXp, levelProgress, xpForLevel } from "./levels";
import { nextStreak, visibleStreak } from "./streak";
import { computeSessionXp } from "./xp";

function makeOutcome(correctCount: number, totalCount: number): SessionOutcome {
  return {
    records: [],
    correctCount,
    totalCount,
    accuracy: totalCount > 0 ? correctCount / totalCount : 0,
    perfect: totalCount > 0 && correctCount === totalCount,
  };
}

describe("levels", () => {
  it("uses growing thresholds", () => {
    expect([1, 2, 3, 4].map(xpForLevel)).toEqual([0, 100, 300, 600]);
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(650)).toBe(4);
  });

  it("reports progress inside the current level", () => {
    expect(levelProgress(150)).toEqual({
      level: 2,
      earnedInLevel: 50,
      neededForNext: 200,
      ratio: 0.25,
    });
  });
});

describe("computeSessionXp", () => {
  it("rewards completion, correct answers and perfection", () => {
    expect(computeSessionXp(makeOutcome(10, 12), "learn")).toBe(20);
    expect(computeSessionXp(makeOutcome(12, 12), "learn")).toBe(27);
    expect(computeSessionXp(makeOutcome(6, 8), "review")).toBe(11);
  });

  it("gives nothing for an empty session and caps answer XP", () => {
    expect(computeSessionXp(makeOutcome(0, 0), "learn")).toBe(0);
    expect(computeSessionXp(makeOutcome(70, 80), "learn")).toBe(40);
  });
});

describe("dates", () => {
  it("uses the Paris calendar day", () => {
    expect(toLocalDay(new Date("2026-11-11T23:30:00Z"))).toBe("2026-11-12");
    expect(shiftDay("2026-03-01", -1)).toBe("2026-02-28");
    expect(lastDays("2026-01-02", 3)).toEqual(["2025-12-31", "2026-01-01", "2026-01-02"]);
  });
});

describe("streak", () => {
  const today = "2026-11-11";

  it("starts, continues and resets", () => {
    expect(nextStreak({ currentStreak: 0, lastActiveOn: null }, today)).toBe(1);
    expect(nextStreak({ currentStreak: 4, lastActiveOn: "2026-11-10" }, today)).toBe(5);
    expect(nextStreak({ currentStreak: 4, lastActiveOn: today }, today)).toBe(4);
    expect(nextStreak({ currentStreak: 4, lastActiveOn: "2026-11-08" }, today)).toBe(1);
  });

  it("hides a streak that was broken", () => {
    expect(visibleStreak({ currentStreak: 4, lastActiveOn: "2026-11-10" }, today)).toBe(4);
    expect(visibleStreak({ currentStreak: 4, lastActiveOn: "2026-11-09" }, today)).toBe(0);
  });
});
