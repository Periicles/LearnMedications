import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { getCompletions, getMasteryRows, getProfile } from "./queries";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
});

describe("getProfile", () => {
  it("maps the profile row of the user", async () => {
    fake.respond("profiles", {
      data: {
        id: "user-1",
        username: "lea",
        avatar: "pill",
        total_xp: 120,
        current_streak: 3,
        longest_streak: 5,
        last_active_on: "2026-11-10",
        created_at: "2026-01-01",
      },
    });
    const profile = await getProfile("user-1");
    expect(profile).toMatchObject({ id: "user-1", totalXp: 120, currentStreak: 3 });
    expect(fake.calls).toContainEqual(
      expect.objectContaining({ method: "eq", args: ["id", "user-1"] }),
    );
  });

  it("returns null when there is no profile", async () => {
    expect(await getProfile("ghost")).toBeNull();
  });
});

describe("getCompletions", () => {
  it("groups completed lessons by collection", async () => {
    fake.respond("lesson_completions", {
      data: [
        { collection_slug: "essentials", lesson_key: "a" },
        { collection_slug: "essentials", lesson_key: "b" },
      ],
    });
    const completions = await getCompletions("user-1");
    expect([...(completions.get("essentials") ?? [])]).toEqual(["a", "b"]);
  });

  it("is empty without data", async () => {
    expect((await getCompletions("user-2")).size).toBe(0);
  });
});

describe("getMasteryRows", () => {
  it("maps mastery rows and tolerates missing data", async () => {
    fake.respond("substance_mastery", {
      data: [
        {
          substance_slug: "morphine",
          strength: 2,
          correct_count: 3,
          wrong_count: 1,
          next_review_at: "2026-11-12T00:00:00Z",
        },
      ],
    });
    expect(await getMasteryRows("user-3")).toEqual([
      {
        substanceSlug: "morphine",
        strength: 2,
        correctCount: 3,
        wrongCount: 1,
        nextReviewAt: "2026-11-12T00:00:00Z",
      },
    ]);
    expect(await getMasteryRows("user-4")).toEqual([]);
  });
});
