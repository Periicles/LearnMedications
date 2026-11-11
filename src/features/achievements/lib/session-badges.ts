import type { Achievement, SessionStats } from "@/types/achievements";
import type { BadgeContext, CompletionMap } from "@/types/progress";
import { findNewAchievements } from "./evaluate";
import { buildAchievementStats } from "./stats";

function withLesson(completions: CompletionMap, context: BadgeContext): CompletionMap {
  const { collectionSlug, lessonKey, mode } = context.input;
  if (mode !== "learn" || !collectionSlug || !lessonKey) return completions;
  const updated: CompletionMap = new Map(completions);
  updated.set(collectionSlug, new Set([...(completions.get(collectionSlug) ?? []), lessonKey]));
  return updated;
}

function withSession(sessions: SessionStats, context: BadgeContext): SessionStats {
  return {
    ...sessions,
    perfectCount: sessions.perfectCount + (context.outcome.perfect ? 1 : 0),
    reviewCount: sessions.reviewCount + (context.input.mode === "review" ? 1 : 0),
  };
}

/** Achievements unlocked by the session being saved, based on the state it leads to. */
export function findSessionBadges(context: BadgeContext): Achievement[] {
  const updatedSlugs = new Set(context.updatedMastery.map((mastery) => mastery.substanceSlug));
  const untouched = context.knownMastery.filter(
    (mastery) => !updatedSlugs.has(mastery.substanceSlug),
  );
  const stats = buildAchievementStats({
    totalXp: context.totalXp,
    streak: context.streak,
    completions: withLesson(context.completions, context),
    mastery: [...untouched, ...context.updatedMastery],
    sessions: withSession(context.sessions, context),
    friendCount: context.friendCount,
  });
  return findNewAchievements(stats, context.ownedKeys);
}
