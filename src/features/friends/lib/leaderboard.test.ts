import { describe, expect, it } from "vitest";
import type { FriendshipRow, LeaderboardRow, PublicProfileRow } from "@/types/social";
import { buildFriendOverview, buildLeaderboard } from "./leaderboard";

function makeRow(username: string, weeklyXp: number, lastActiveOn: string | null): LeaderboardRow {
  return {
    id: username,
    username,
    avatar: "💊",
    total_xp: 320,
    current_streak: 4,
    last_active_on: lastActiveOn,
    weekly_xp: weeklyXp,
  };
}

describe("buildLeaderboard", () => {
  it("shares ranks on ties and hides broken streaks", () => {
    const entries = buildLeaderboard(
      [
        makeRow("bob", 80, "2026-11-11"),
        makeRow("alice", 80, "2026-11-01"),
        makeRow("carol", 10, null),
      ],
      "alice",
      "2026-11-11",
    );
    expect(entries.map((entry) => entry.rank)).toEqual([1, 1, 3]);
    expect(entries[0]).toMatchObject({ streak: 4, level: 3, isSelf: false });
    expect(entries[1]).toMatchObject({ streak: 0, isSelf: true });
  });
});

describe("buildFriendOverview", () => {
  it("separates friends, received and sent requests", () => {
    const profiles: PublicProfileRow[] = ["bob", "carol", "dave"].map((username) => ({
      id: username,
      username,
      avatar: "💊",
      total_xp: 0,
    }));
    const rows: FriendshipRow[] = [
      { requester_id: "alice", addressee_id: "bob", status: "accepted" },
      { requester_id: "carol", addressee_id: "alice", status: "pending" },
      { requester_id: "alice", addressee_id: "dave", status: "pending" },
      { requester_id: "alice", addressee_id: "ghost", status: "pending" },
    ];
    const overview = buildFriendOverview(rows, profiles, "alice");
    expect(overview.friends.map((person) => person.username)).toEqual(["bob"]);
    expect(overview.received.map((person) => person.username)).toEqual(["carol"]);
    expect(overview.sent.map((person) => person.username)).toEqual(["dave"]);
  });
});
