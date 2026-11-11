import type { CompletionMap, Mastery } from "./progress";

export interface AchievementStats {
  totalXp: number;
  level: number;
  streak: number;
  lessonCount: number;
  perfectCount: number;
  reviewCount: number;
  learnedCount: number;
  masteredCount: number;
  finishedPaths: number;
  friendCount: number;
}

export type AchievementMetric = keyof AchievementStats;

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  metric: AchievementMetric;
  threshold: number;
}

export interface AchievementView {
  achievement: Achievement;
  unlockedAt: string | null;
  current: number;
}

export interface SessionStatsRow {
  session_count: number;
  perfect_count: number;
  review_count: number;
  answer_count: number;
  correct_count: number;
}

export interface SessionStats {
  sessionCount: number;
  perfectCount: number;
  reviewCount: number;
  answerCount: number;
  correctCount: number;
}

export interface AchievementRow {
  achievement_key: string;
  unlocked_at: string;
}

export interface AchievementCardProps {
  view: AchievementView;
}

export interface StatsSources {
  totalXp: number;
  streak: number;
  completions: CompletionMap;
  mastery: Mastery[];
  sessions: SessionStats;
  friendCount: number;
}
