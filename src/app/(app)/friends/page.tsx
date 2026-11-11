import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/features/auth/lib/session";
import { AddFriendForm } from "@/features/friends/components/add-friend-form";
import { FriendList } from "@/features/friends/components/friend-list";
import { Leaderboard } from "@/features/friends/components/leaderboard";
import { RequestList } from "@/features/friends/components/request-list";
import { buildLeaderboard } from "@/features/friends/lib/leaderboard";
import { getFriendOverview, getLeaderboardRows } from "@/features/friends/lib/queries";
import { toLocalDay } from "@/features/progress/lib/dates";

export const metadata: Metadata = { title: "Amis" };

export default async function FriendsPage() {
  const user = await requireUser();
  const [overview, leaderboardRows] = await Promise.all([
    getFriendOverview(user.id),
    getLeaderboardRows(),
  ]);
  const entries = buildLeaderboard(leaderboardRows, user.id, toLocalDay(new Date()));

  return (
    <>
      <PageHeader title="Amis" subtitle="Progressez ensemble et comparez vos semaines." />
      <RequestList title="Demandes reçues" people={overview.received} kind="received" />
      <Leaderboard entries={entries} />
      <AddFriendForm />
      <FriendList friends={overview.friends} />
      <RequestList title="Demandes envoyées" people={overview.sent} kind="sent" />
    </>
  );
}
