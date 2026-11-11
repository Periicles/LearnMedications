import "server-only";
import { ACHIEVEMENTS } from "@/features/achievements/catalog";
import { createAdminSupabase } from "@/lib/supabase/admin";

async function grantBadgesTo(userIds: string[]): Promise<void> {
  const admin = createAdminSupabase();
  for (const userId of userIds) {
    const { count } = await admin
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    const earned = ACHIEVEMENTS.filter(
      (achievement) =>
        achievement.metric === "friendCount" && achievement.threshold <= (count ?? 0),
    ).map((achievement) => ({ user_id: userId, achievement_key: achievement.key }));
    if (earned.length > 0) {
      await admin.from("user_achievements").upsert(earned, { ignoreDuplicates: true });
    }
  }
}

/**
 * Grants the friendship achievements both users may have reached after a request is accepted.
 * A failure here must not undo or hide the accepted friendship, so it is only logged.
 */
export async function grantFriendBadges(userIds: string[]): Promise<void> {
  try {
    await grantBadgesTo(userIds);
  } catch (error) {
    console.error("Could not grant friendship achievements", error);
  }
}
