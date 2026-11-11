import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { EMPTY_SESSION_STATS } from "@/features/achievements/lib/stats";
import type { Profile, SessionInput } from "@/types/progress";
import { completeSession } from "./actions";
import { toLocalDay } from "./lib/dates";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  requireUser: vi.fn(),
  getProfile: vi.fn(),
  getMasteryRows: vi.fn(),
  getCompletions: vi.fn(),
  getSessionStats: vi.fn(),
  getUnlockedAchievements: vi.fn(),
  getFriendCount: vi.fn(),
  saveSession: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/auth/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/features/friends/lib/queries", () => ({ getFriendCount: mocks.getFriendCount }));
vi.mock("@/features/achievements/lib/queries", () => ({
  getSessionStats: mocks.getSessionStats,
  getUnlockedAchievements: mocks.getUnlockedAchievements,
}));
vi.mock("./lib/queries", () => ({
  getProfile: mocks.getProfile,
  getMasteryRows: mocks.getMasteryRows,
  getCompletions: mocks.getCompletions,
}));
vi.mock("./lib/save-session", () => ({ saveSession: mocks.saveSession }));

const [collection] = getCatalog().collections;
const [lesson, secondLesson] = collection.lessons;
const slug = lesson.substanceSlugs[0];
const today = toLocalDay(new Date());

const profile: Profile = {
  id: "user-1",
  username: "lea",
  avatar: "pill",
  totalXp: 95,
  currentStreak: 2,
  longestStreak: 2,
  lastActiveOn: "2000-01-01",
  createdAt: "2026-01-01",
};
const learnInput: SessionInput = {
  mode: "learn",
  collectionSlug: collection.slug,
  lessonKey: lesson.key,
  records: [{ substanceSlug: slug, correct: true }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireUser.mockResolvedValue({ id: "user-1", email: "lea@example.com" });
  mocks.getProfile.mockResolvedValue(profile);
  mocks.getMasteryRows.mockResolvedValue([]);
  mocks.getCompletions.mockResolvedValue(new Map());
  mocks.getSessionStats.mockResolvedValue(EMPTY_SESSION_STATS);
  mocks.getUnlockedAchievements.mockResolvedValue(new Map());
  mocks.getFriendCount.mockResolvedValue(0);
  mocks.saveSession.mockImplementation(async (save) => profile.totalXp + save.xpGained);
});

describe("completeSession rejections", () => {
  it("ignores invalid input", async () => {
    expect(await completeSession({ mode: "learn", records: [] })).toBeNull();
    expect(mocks.saveSession).not.toHaveBeenCalled();
  });

  it("ignores unknown and locked lessons", async () => {
    expect(await completeSession({ ...learnInput, lessonKey: "missing" })).toBeNull();
    expect(await completeSession({ ...learnInput, lessonKey: secondLesson.key })).toBeNull();
    expect(mocks.saveSession).not.toHaveBeenCalled();
  });

  it("ignores a missing profile and a failed save", async () => {
    mocks.getProfile.mockResolvedValue(null);
    expect(await completeSession(learnInput)).toBeNull();
    mocks.getProfile.mockResolvedValue(profile);
    mocks.saveSession.mockResolvedValue(null);
    expect(await completeSession(learnInput)).toBeNull();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe("completeSession rewards", () => {
  it("rewards a lesson with xp, a new streak, a level-up and badges", async () => {
    const reward = await completeSession(learnInput);
    expect(reward).toMatchObject({
      xpGained: 16,
      totalXp: 111,
      level: 2,
      leveledUp: true,
      streak: 1,
      streakExtended: true,
    });
    expect(reward?.badges.map((badge) => badge.key)).toEqual([
      "first-lesson",
      "perfect-1",
      "xp-100",
    ]);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(mocks.saveSession.mock.calls[0][0]).toMatchObject({
      userId: "user-1",
      today,
      badgeKeys: ["first-lesson", "perfect-1", "xp-100"],
    });
  });

  it("rewards a review without level-up when already active today", async () => {
    mocks.getProfile.mockResolvedValue({ ...profile, totalXp: 10, lastActiveOn: today });
    mocks.getUnlockedAchievements.mockResolvedValue(new Map([["perfect-1", "x"]]));
    mocks.saveSession.mockResolvedValue(15);
    const reward = await completeSession({
      mode: "review",
      records: [{ substanceSlug: slug, correct: false }],
    });
    expect(reward).toMatchObject({ xpGained: 5, leveledUp: false, streakExtended: false });
    expect(reward?.badges).toEqual([]);
  });
});
