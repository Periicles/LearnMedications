import { beforeEach, describe, expect, it, vi } from "vitest";
import { toLocalDay } from "@/features/progress/lib/dates";
import { loadAchievementStats } from "./overview";
import { EMPTY_SESSION_STATS } from "./stats";

const mocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
  getCompletions: vi.fn(),
  getMasteryRows: vi.fn(),
  getSessionStats: vi.fn(),
}));

vi.mock("@/features/progress/lib/queries", () => ({
  getProfile: mocks.getProfile,
  getCompletions: mocks.getCompletions,
  getMasteryRows: mocks.getMasteryRows,
}));
vi.mock("./queries", () => ({ getSessionStats: mocks.getSessionStats }));

const profile = {
  totalXp: 320,
  currentStreak: 2,
  longestStreak: 6,
  lastActiveOn: toLocalDay(new Date()),
};

beforeEach(() => {
  mocks.getCompletions.mockResolvedValue(new Map());
  mocks.getMasteryRows.mockResolvedValue([]);
  mocks.getSessionStats.mockResolvedValue({ ...EMPTY_SESSION_STATS, perfectCount: 2 });
});

describe("loadAchievementStats", () => {
  it("returns null without a profile", async () => {
    mocks.getProfile.mockResolvedValue(null);
    expect(await loadAchievementStats("user-1", 0)).toBeNull();
  });

  it("combines profile, sessions and friends, keeping the best streak", async () => {
    mocks.getProfile.mockResolvedValue(profile);
    expect(await loadAchievementStats("user-1", 3)).toMatchObject({
      totalXp: 320,
      level: 3,
      streak: 6,
      perfectCount: 2,
      friendCount: 3,
    });
  });
});
