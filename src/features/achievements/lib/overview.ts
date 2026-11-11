import "server-only";
import { toLocalDay } from "@/features/progress/lib/dates";
import { getCompletions, getMasteryRows, getProfile } from "@/features/progress/lib/queries";
import { visibleStreak } from "@/features/progress/lib/streak";
import type { AchievementStats } from "@/types/achievements";
import { getSessionStats } from "./queries";
import { buildAchievementStats } from "./stats";

/** Current counters of a signed-in user, shared by the achievements and profile pages. */
export async function loadAchievementStats(
  userId: string,
  friendCount: number,
): Promise<AchievementStats | null> {
  const [profile, completions, mastery, sessions] = await Promise.all([
    getProfile(userId),
    getCompletions(userId),
    getMasteryRows(userId),
    getSessionStats(),
  ]);
  if (!profile) return null;
  return buildAchievementStats({
    totalXp: profile.totalXp,
    streak: Math.max(visibleStreak(profile, toLocalDay(new Date())), profile.longestStreak),
    completions,
    mastery,
    sessions,
    friendCount,
  });
}
