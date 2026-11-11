import { beforeEach, describe, expect, it, vi } from "vitest";
import { outcomeFromRecords } from "@/features/quiz/lib/session";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { SessionSave } from "@/types/progress";
import type { FakeSupabase } from "@/types/testing";
import { saveSession } from "./save-session";

const mocks = vi.hoisted(() => ({ createAdminSupabase: vi.fn() }));

vi.mock("@/lib/supabase/admin", () => ({ createAdminSupabase: mocks.createAdminSupabase }));

const records = [{ substanceSlug: "morphine", correct: true }];
const outcome = outcomeFromRecords(records);
const mastery = [
  { substanceSlug: "morphine", strength: 1, correctCount: 1, wrongCount: 0, nextReviewAt: "soon" },
];

function makeSave(overrides: Partial<SessionSave>): SessionSave {
  return {
    userId: "user-1",
    input: { mode: "learn", collectionSlug: "essentials", lessonKey: "intro", records },
    outcome,
    accuracy: 1,
    xpGained: 16,
    today: "2026-11-11",
    streak: 2,
    mastery,
    badgeKeys: ["first-lesson"],
    ...overrides,
  };
}

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createAdminSupabase.mockReturnValue(fake.client);
});

describe("saveSession", () => {
  it("sends a lesson with its completion and returns the new total", async () => {
    fake.respond("apply_session_result", { data: 216 });
    expect(await saveSession(makeSave({}))).toBe(216);
    expect(fake.calls[0].args[0]).toMatchObject({
      p_user_id: "user-1",
      p_mode: "learn",
      p_xp: 16,
      p_lesson: { collection_slug: "essentials", lesson_key: "intro", accuracy: 1 },
      p_mastery: [{ substance_slug: "morphine", next_review_at: "soon" }],
      p_achievements: ["first-lesson"],
    });
  });

  it("sends no lesson for a review", async () => {
    fake.respond("apply_session_result", { data: 20 });
    await saveSession(makeSave({ input: { mode: "review", records } }));
    expect(fake.calls[0].args[0]).toMatchObject({ p_mode: "review", p_lesson: null });
  });

  it("returns null on a database error or an unexpected payload", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    fake.respond("apply_session_result", { error: { message: "boom" } });
    expect(await saveSession(makeSave({}))).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Could not save session", "boom");
    fake.respond("apply_session_result", { data: "nope" });
    expect(await saveSession(makeSave({}))).toBeNull();
    consoleSpy.mockRestore();
  });
});
