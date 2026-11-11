import { beforeAll, describe, expect, it } from "vitest";
import type { TestDatabase } from "@/types/database-test";
import { createTestDatabase } from "./test-database";

describe("profiles migration", () => {
  let testDb: TestDatabase;
  let aliceId: string;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    aliceId = await testDb.createUser("alice");
  });

  it("creates a profile when a user signs up", async () => {
    const rows = await testDb.runAsUser<Record<"username", string>>(
      aliceId,
      `select username from public.profiles where id = '${aliceId}'`,
    );
    expect(rows).toEqual([{ username: "alice" }]);
  });

  it("falls back to a unique username on conflicts and invalid names", async () => {
    const twinId = await testDb.createUser("alice");
    const oddId = await testDb.createUser("Not Valid!");
    const result = await testDb.database.query<Record<"username", string>>(
      "select username from public.profiles where id = any($1) order by username",
      [[twinId, oddId]],
    );
    expect(result.rows[0].username).toMatch(/^alice_[0-9a-f]{4}$/);
    expect(result.rows[1].username).toBe("user");
  });

  it("reports username availability", async () => {
    const result = await testDb.database.query<Record<"free" | "taken", boolean>>(
      "select public.is_username_available('nobody') as free, public.is_username_available('ALICE') as taken",
    );
    expect(result.rows[0]).toEqual({ free: true, taken: false });
  });

  it("lets users edit their avatar but not their XP or other profiles", async () => {
    await testDb.runAsUser(
      aliceId,
      `update public.profiles set avatar = '🧪' where id = '${aliceId}'`,
    );
    await expect(
      testDb.runAsUser(
        aliceId,
        `update public.profiles set total_xp = 9999 where id = '${aliceId}'`,
      ),
    ).rejects.toThrow(/permission denied/);
    const bobId = await testDb.createUser("bob");
    await testDb.runAsUser(
      aliceId,
      `update public.profiles set avatar = '😈' where id = '${bobId}'`,
    );
    const result = await testDb.database.query<Record<"avatar", string>>(
      "select avatar from public.profiles where id = $1",
      [bobId],
    );
    expect(result.rows[0].avatar).toBe("💊");
  });
});
