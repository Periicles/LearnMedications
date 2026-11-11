import { beforeAll, describe, expect, it } from "vitest";
import type { TestDatabase } from "@/types/database-test";
import { createTestDatabase } from "./test-database";

describe("friendships migration", () => {
  let testDb: TestDatabase;
  let aliceId: string;
  let bobId: string;
  let carolId: string;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    aliceId = await testDb.createUser("alice");
    bobId = await testDb.createUser("bob");
    carolId = await testDb.createUser("carol");
    await testDb.database.query(
      "insert into public.study_sessions (user_id, mode, xp, correct_count, total_count) values ($1, 'learn', 30, 5, 5), ($2, 'learn', 50, 5, 5), ($3, 'learn', 99, 5, 5)",
      [aliceId, bobId, carolId],
    );
  });

  it("lets a user send a request only as themselves", async () => {
    await testDb.runAsUser(
      aliceId,
      `insert into public.friendships (requester_id, addressee_id) values ('${aliceId}', '${bobId}')`,
    );
    await expect(
      testDb.runAsUser(
        aliceId,
        `insert into public.friendships (requester_id, addressee_id) values ('${carolId}', '${bobId}')`,
      ),
    ).rejects.toThrow(/row-level security/);
    await expect(
      testDb.runAsUser(
        aliceId,
        `insert into public.friendships (requester_id, addressee_id, status) values ('${aliceId}', '${carolId}', 'accepted')`,
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("rejects a duplicate request in the opposite direction", async () => {
    await expect(
      testDb.runAsUser(
        bobId,
        `insert into public.friendships (requester_id, addressee_id) values ('${bobId}', '${aliceId}')`,
      ),
    ).rejects.toThrow(/friendships_pair_idx/);
  });

  it("only lets the addressee accept, and hides the relation from strangers", async () => {
    const accept = `update public.friendships set status = 'accepted', responded_at = now() where requester_id = '${aliceId}' and addressee_id = '${bobId}' returning status`;
    expect(await testDb.runAsUser(aliceId, accept)).toEqual([]);
    expect(await testDb.runAsUser(carolId, "select 1 from public.friendships")).toEqual([]);
    expect(await testDb.runAsUser(bobId, accept)).toEqual([{ status: "accepted" }]);
  });

  it("ranks the caller and accepted friends by weekly XP", async () => {
    const board = await testDb.runAsUser<Record<"username" | "weekly_xp", unknown>>(
      aliceId,
      "select username, weekly_xp from public.get_friend_leaderboard('Europe/Paris')",
    );
    expect(board).toEqual([
      { username: "bob", weekly_xp: 50 },
      { username: "alice", weekly_xp: 30 },
    ]);
    const alone = await testDb.runAsUser<Record<"username", string>>(
      carolId,
      "select username from public.get_friend_leaderboard('Europe/Paris')",
    );
    expect(alone).toEqual([{ username: "carol" }]);
  });

  it("lets either side remove the friendship", async () => {
    const removed = await testDb.runAsUser(
      aliceId,
      `delete from public.friendships where requester_id = '${aliceId}' and addressee_id = '${bobId}' returning 1 as done`,
    );
    expect(removed).toHaveLength(1);
  });
});
