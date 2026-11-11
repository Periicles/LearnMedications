import "server-only";
import { cache } from "react";
import { APP_TIME_ZONE } from "@/features/progress/constants";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  FriendOverview,
  FriendshipRow,
  LeaderboardRow,
  PublicProfileRow,
} from "@/types/social";
import { buildFriendOverview } from "./leaderboard";

const getFriendships = cache(async (): Promise<FriendshipRow[]> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id, status")
    .overrideTypes<FriendshipRow[]>();
  return data ?? [];
});

export async function getFriendCount(): Promise<number> {
  const rows = await getFriendships();
  return rows.filter((record) => record.status === "accepted").length;
}

export async function getFriendOverview(selfId: string): Promise<FriendOverview> {
  const rows = await getFriendships();
  const otherIds = rows.map((record) =>
    record.requester_id === selfId ? record.addressee_id : record.requester_id,
  );
  if (otherIds.length === 0) return { friends: [], received: [], sent: [] };
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, avatar, total_xp")
    .in("id", otherIds)
    .overrideTypes<PublicProfileRow[]>();
  return buildFriendOverview(rows, data ?? [], selfId);
}

export async function getLeaderboardRows(): Promise<LeaderboardRow[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.rpc("get_friend_leaderboard", { p_time_zone: APP_TIME_ZONE });
  return (data as LeaderboardRow[] | null) ?? [];
}
