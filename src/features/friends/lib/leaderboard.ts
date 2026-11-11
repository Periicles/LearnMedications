import { levelFromXp } from "@/features/progress/lib/levels";
import { visibleStreak } from "@/features/progress/lib/streak";
import type {
  FriendOverview,
  FriendshipRow,
  FriendSummary,
  LeaderboardEntry,
  LeaderboardRow,
  PublicProfileRow,
} from "@/types/social";

/** Ranks rows already sorted by weekly XP; ties share the same rank. */
export function buildLeaderboard(
  rows: LeaderboardRow[],
  selfId: string,
  today: string,
): LeaderboardEntry[] {
  let rank = 0;
  return rows.map((record, index) => {
    const isTied = index > 0 && rows[index - 1].weekly_xp === record.weekly_xp;
    rank = isTied ? rank : index + 1;
    return {
      id: record.id,
      rank,
      username: record.username,
      avatar: record.avatar,
      level: levelFromXp(record.total_xp),
      streak: visibleStreak(
        { currentStreak: record.current_streak, lastActiveOn: record.last_active_on },
        today,
      ),
      weeklyXp: record.weekly_xp,
      isSelf: record.id === selfId,
    };
  });
}

function toSummary(profile: PublicProfileRow): FriendSummary {
  return {
    id: profile.id,
    username: profile.username,
    avatar: profile.avatar,
    level: levelFromXp(profile.total_xp),
  };
}

/** Splits the caller's relations into friends, received requests and sent requests. */
export function buildFriendOverview(
  rows: FriendshipRow[],
  profiles: PublicProfileRow[],
  selfId: string,
): FriendOverview {
  const byId = new Map(profiles.map((profile) => [profile.id, toSummary(profile)]));
  const overview: FriendOverview = { friends: [], received: [], sent: [] };
  for (const record of rows) {
    const isRequester = record.requester_id === selfId;
    const person = byId.get(isRequester ? record.addressee_id : record.requester_id);
    if (!person) continue;
    if (record.status === "accepted") overview.friends.push(person);
    else if (isRequester) overview.sent.push(person);
    else overview.received.push(person);
  }
  return overview;
}
