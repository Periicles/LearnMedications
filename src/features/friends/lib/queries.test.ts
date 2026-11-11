import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { getFriendCount, getFriendOverview, getLeaderboardRows } from "./queries";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn() }));

vi.mock("react", () => ({ cache: <Wrapped>(wrapped: Wrapped) => wrapped }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
});

describe("getFriendCount", () => {
  it("counts accepted friendships only", async () => {
    fake.respond("friendships", {
      data: [
        { requester_id: "u1", addressee_id: "u2", status: "accepted" },
        { requester_id: "u3", addressee_id: "u1", status: "pending" },
      ],
    });
    await expect(getFriendCount()).resolves.toBe(1);
  });

  it("is zero without data", async () => {
    await expect(getFriendCount()).resolves.toBe(0);
  });
});

describe("getFriendOverview", () => {
  it("skips the profile lookup when there are no relations", async () => {
    await expect(getFriendOverview("u1")).resolves.toEqual({ friends: [], received: [], sent: [] });
    expect(fake.calls.some((call) => call.target === "profiles")).toBe(false);
  });

  it("looks up the other side of every relation", async () => {
    fake.respond("friendships", {
      data: [
        { requester_id: "u1", addressee_id: "u2", status: "accepted" },
        { requester_id: "u3", addressee_id: "u1", status: "pending" },
      ],
    });
    fake.respond("profiles", {
      data: [
        { id: "u2", username: "bob", avatar: "💊", total_xp: 0 },
        { id: "u3", username: "carol", avatar: "🧪", total_xp: 0 },
      ],
    });
    const overview = await getFriendOverview("u1");
    expect(fake.calls.find((call) => call.method === "in")?.args).toEqual(["id", ["u2", "u3"]]);
    expect(overview.friends.map((person) => person.username)).toEqual(["bob"]);
    expect(overview.received.map((person) => person.username)).toEqual(["carol"]);
  });

  it("tolerates a missing profile list", async () => {
    fake.respond("friendships", {
      data: [{ requester_id: "u1", addressee_id: "u2", status: "pending" }],
    });
    await expect(getFriendOverview("u1")).resolves.toEqual({ friends: [], received: [], sent: [] });
  });
});

describe("getLeaderboardRows", () => {
  it("returns the rpc rows or an empty list", async () => {
    await expect(getLeaderboardRows()).resolves.toEqual([]);
    fake.respond("get_friend_leaderboard", { data: [{ id: "u1" }] });
    await expect(getLeaderboardRows()).resolves.toEqual([{ id: "u1" }]);
  });
});
