import { beforeAll, describe, expect, it } from "vitest";
import type { TestDatabase } from "@/types/database-test";
import { createTestDatabase } from "./test-database";

const APPLY_SQL = `select public.apply_session_result(
  $1, 'learn', $2, 9, 10, $3::date, $4, $5::jsonb, $6::jsonb, $7::text[]
) as total`;

describe("progress migration", () => {
  let testDb: TestDatabase;
  let aliceId: string;
  let bobId: string;

  const applySession = (xpGain: number, today: string, streak: number, strength: number) =>
    testDb.database.query<Record<"total", number>>(APPLY_SQL, [
      aliceId,
      xpGain,
      today,
      streak,
      JSON.stringify({ collection_slug: "essentials", lesson_key: "ibuprofen", accuracy: 0.9 }),
      JSON.stringify([
        {
          substance_slug: "ibuprofen",
          strength,
          correct_count: strength,
          wrong_count: 0,
          next_review_at: "2026-11-12T10:00:00Z",
        },
      ]),
      ["first-lesson"],
    ]);

  beforeAll(async () => {
    testDb = await createTestDatabase();
    aliceId = await testDb.createUser("alice");
    bobId = await testDb.createUser("bob");
    await applySession(20, "2026-11-10", 1, 1);
    await applySession(25, "2026-11-11", 2, 2);
  });

  it("accumulates XP and keeps the longest streak", async () => {
    const result = await testDb.database.query<Record<string, unknown>>(
      "select total_xp, current_streak, longest_streak, last_active_on::text from public.profiles where id = $1",
      [aliceId],
    );
    expect(result.rows[0]).toEqual({
      total_xp: 45,
      current_streak: 2,
      longest_streak: 2,
      last_active_on: "2026-11-11",
    });
  });

  it("upserts completions, mastery and achievements", async () => {
    const completions = await testDb.runAsUser<Record<"completions", number>>(
      aliceId,
      "select completions from public.lesson_completions",
    );
    const mastery = await testDb.runAsUser<Record<"strength", number>>(
      aliceId,
      "select strength from public.substance_mastery",
    );
    const badges = await testDb.runAsUser(aliceId, "select 1 from public.user_achievements");
    expect(completions).toEqual([{ completions: 2 }]);
    expect(mastery).toEqual([{ strength: 2 }]);
    expect(badges).toHaveLength(1);
  });

  it("hides private progress from other users but shares achievements", async () => {
    expect(await testDb.runAsUser(bobId, "select 1 from public.study_sessions")).toEqual([]);
    expect(await testDb.runAsUser(bobId, "select 1 from public.substance_mastery")).toEqual([]);
    expect(await testDb.runAsUser(bobId, "select 1 from public.user_achievements")).toHaveLength(1);
  });

  it("aggregates the caller's own session statistics", async () => {
    const stats = await testDb.runAsUser(aliceId, "select * from public.get_session_stats()");
    expect(stats).toEqual([
      { session_count: 2, perfect_count: 0, review_count: 0, answer_count: 20, correct_count: 18 },
    ]);
    const daily = await testDb.runAsUser<Record<"xp", number>>(
      aliceId,
      "select xp from public.get_daily_xp('Europe/Paris', 30)",
    );
    expect(daily).toEqual([{ xp: 45 }]);
    const others = await testDb.runAsUser<Record<"session_count", number>>(
      bobId,
      "select session_count from public.get_session_stats()",
    );
    expect(others).toEqual([{ session_count: 0 }]);
  });

  it("forbids users from writing progress or calling the function directly", async () => {
    await expect(
      testDb.runAsUser(
        bobId,
        `insert into public.study_sessions (user_id, mode, xp, correct_count, total_count) values ('${bobId}', 'learn', 999, 1, 1)`,
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      testDb.runAsUser(
        bobId,
        `select public.apply_session_result('${bobId}', 'learn', 999, 1, 1, current_date, 1, null, null, null)`,
      ),
    ).rejects.toThrow(/permission denied/);
  });
});
