import type { Achievement, AchievementStats, AchievementView } from "@/types/achievements";
import { ACHIEVEMENTS } from "../catalog";

/** Achievements whose threshold is reached and that the user does not own yet. */
export function findNewAchievements(stats: AchievementStats, ownedKeys: string[]): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      stats[achievement.metric] >= achievement.threshold && !ownedKeys.includes(achievement.key),
  );
}

export function buildAchievementViews(
  stats: AchievementStats,
  unlockedDates: Map<string, string>,
): AchievementView[] {
  return ACHIEVEMENTS.map((achievement) => ({
    achievement,
    unlockedAt: unlockedDates.get(achievement.key) ?? null,
    current: Math.min(stats[achievement.metric], achievement.threshold),
  }));
}
