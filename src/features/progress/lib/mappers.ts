import type {
  CompletionMap,
  CompletionRow,
  Mastery,
  MasteryRow,
  Profile,
  ProfileRow,
} from "@/types/progress";

export function toProfile(record: ProfileRow): Profile {
  return {
    id: record.id,
    username: record.username,
    avatar: record.avatar,
    totalXp: record.total_xp,
    currentStreak: record.current_streak,
    longestStreak: record.longest_streak,
    lastActiveOn: record.last_active_on,
    createdAt: record.created_at,
  };
}

export function toMastery(record: MasteryRow): Mastery {
  return {
    substanceSlug: record.substance_slug,
    strength: record.strength,
    correctCount: record.correct_count,
    wrongCount: record.wrong_count,
    nextReviewAt: record.next_review_at,
  };
}

export function toCompletionMap(records: CompletionRow[]): CompletionMap {
  const completions: CompletionMap = new Map();
  for (const record of records) {
    const keys = completions.get(record.collection_slug) ?? new Set<string>();
    keys.add(record.lesson_key);
    completions.set(record.collection_slug, keys);
  }
  return completions;
}
