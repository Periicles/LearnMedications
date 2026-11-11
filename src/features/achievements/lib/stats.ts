import { getCatalog } from "@/features/content/lib/catalog";
import { levelFromXp } from "@/features/progress/lib/levels";
import { isMastered } from "@/features/progress/lib/mastery";
import type { AchievementStats, SessionStats, StatsSources } from "@/types/achievements";
import type { CompletionMap } from "@/types/progress";

export const EMPTY_SESSION_STATS: SessionStats = {
  sessionCount: 0,
  perfectCount: 0,
  reviewCount: 0,
  answerCount: 0,
  correctCount: 0,
};

export function countLessons(completions: CompletionMap): number {
  return [...completions.values()].reduce((total, keys) => total + keys.size, 0);
}

export function countFinishedPaths(completions: CompletionMap): number {
  return getCatalog().collections.filter((collection) => {
    const completed = completions.get(collection.slug);
    return (
      completed !== undefined && collection.lessons.every((lesson) => completed.has(lesson.key))
    );
  }).length;
}

export function buildAchievementStats(sources: StatsSources): AchievementStats {
  const { totalXp, streak, completions, mastery, sessions, friendCount } = sources;
  return {
    totalXp,
    level: levelFromXp(totalXp),
    streak,
    lessonCount: countLessons(completions),
    perfectCount: sessions.perfectCount,
    reviewCount: sessions.reviewCount,
    learnedCount: mastery.length,
    masteredCount: mastery.filter(isMastered).length,
    finishedPaths: countFinishedPaths(completions),
    friendCount,
  };
}
