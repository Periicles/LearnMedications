import type { ReactNode } from "react";
import type { SessionStats } from "./achievements";
import type { Collection, Lesson } from "./content";
import type { AnswerRecord, LessonPlan, PlanMode, SessionOutcome } from "./quiz";

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveOn: string | null;
  createdAt: string;
}

export interface ProfileRow {
  id: string;
  username: string;
  avatar: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_on: string | null;
  created_at: string;
}

export interface LevelProgress {
  level: number;
  earnedInLevel: number;
  neededForNext: number;
  ratio: number;
}

export interface StreakState {
  currentStreak: number;
  lastActiveOn: string | null;
}

export interface Mastery {
  substanceSlug: string;
  strength: number;
  correctCount: number;
  wrongCount: number;
  nextReviewAt: string;
}

export interface MasteryRow {
  substance_slug: string;
  strength: number;
  correct_count: number;
  wrong_count: number;
  next_review_at: string;
}

export interface CompletionRow {
  collection_slug: string;
  lesson_key: string;
  best_accuracy: number;
  completions: number;
}

/** Completed lesson keys by collection slug. */
export type CompletionMap = Map<string, Set<string>>;

export interface SessionInput {
  mode: PlanMode;
  collectionSlug?: string;
  lessonKey?: string;
  records: AnswerRecord[];
}

export interface UnlockedBadge {
  key: string;
  title: string;
  icon: string;
}

export interface SessionReward {
  xpGained: number;
  totalXp: number;
  level: number;
  leveledUp: boolean;
  streak: number;
  streakExtended: boolean;
  badges: UnlockedBadge[];
}

export type RewardState =
  { status: "pending" } | { status: "failed" } | { status: "ready"; reward: SessionReward };

export type LessonStatus = "completed" | "current" | "locked";

export interface LessonNode {
  lesson: Lesson;
  status: LessonStatus;
  areaName: string;
}

export interface CollectionProgress {
  collection: Collection;
  completedCount: number;
  nextLesson: Lesson | null;
}

export interface TrackedLessonProps {
  plan: LessonPlan;
  exitHref: string;
  context: Omit<SessionInput, "records">;
}

export interface RewardPanelProps {
  state: RewardState;
}

export interface CollectionCardProps {
  progress: CollectionProgress;
}

export interface CollectionSectionProps {
  title: string;
  items: CollectionProgress[];
}

export interface LessonNodeProps {
  node: LessonNode;
  href: string;
  position: number;
}

export interface LevelBadgeProps {
  totalXp: number;
  children?: ReactNode;
}

export interface SessionSave {
  userId: string;
  input: SessionInput;
  outcome: SessionOutcome;
  accuracy: number;
  xpGained: number;
  today: string;
  streak: number;
  mastery: Mastery[];
  badgeKeys: string[];
}

export interface LessonPathProps {
  collectionSlug: string;
  nodes: LessonNode[];
}

export interface LessonRouteParams {
  collection: string;
  lesson: string;
}

export interface LessonScreenProps {
  params: Promise<LessonRouteParams>;
}

export interface BadgeContext {
  input: SessionInput;
  outcome: SessionOutcome;
  totalXp: number;
  streak: number;
  completions: CompletionMap;
  knownMastery: Mastery[];
  updatedMastery: Mastery[];
  sessions: SessionStats;
  friendCount: number;
  ownedKeys: string[];
}
