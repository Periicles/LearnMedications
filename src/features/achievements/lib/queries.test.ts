import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { getSessionStats, getUnlockedAchievements } from "./queries";
import { EMPTY_SESSION_STATS } from "./stats";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
});

describe("getUnlockedAchievements", () => {
  it("maps unlock dates by key", async () => {
    fake.respond("user_achievements", {
      data: [{ achievement_key: "streak-3", unlocked_at: "2026-11-11T00:00:00Z" }],
    });
    const unlocked = await getUnlockedAchievements("user-1");
    expect(unlocked.get("streak-3")).toBe("2026-11-11T00:00:00Z");
  });

  it("is empty without data", async () => {
    expect((await getUnlockedAchievements("user-2")).size).toBe(0);
  });
});

describe("getSessionStats", () => {
  it("maps the stats row", async () => {
    fake.respond("get_session_stats", {
      data: {
        session_count: 4,
        perfect_count: 2,
        review_count: 1,
        answer_count: 40,
        correct_count: 35,
      },
    });
    expect(await getSessionStats()).toEqual({
      sessionCount: 4,
      perfectCount: 2,
      reviewCount: 1,
      answerCount: 40,
      correctCount: 35,
    });
  });

  it("falls back to empty stats", async () => {
    expect(await getSessionStats()).toEqual(EMPTY_SESSION_STATS);
  });
});
