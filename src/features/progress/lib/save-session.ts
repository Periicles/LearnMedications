import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { SessionSave } from "@/types/progress";

/** Persists a finished session atomically and returns the new XP total. */
export async function saveSession(save: SessionSave): Promise<number | null> {
  const { input, outcome, accuracy } = save;
  const isLesson = input.mode === "learn";
  const { data, error } = await createAdminSupabase().rpc("apply_session_result", {
    p_user_id: save.userId,
    p_mode: input.mode,
    p_xp: save.xpGained,
    p_correct_count: outcome.correctCount,
    p_total_count: outcome.totalCount,
    p_today: save.today,
    p_streak: save.streak,
    p_lesson: isLesson
      ? { collection_slug: input.collectionSlug, lesson_key: input.lessonKey, accuracy }
      : null,
    p_mastery: save.mastery.map((mastery) => ({
      substance_slug: mastery.substanceSlug,
      strength: mastery.strength,
      correct_count: mastery.correctCount,
      wrong_count: mastery.wrongCount,
      next_review_at: mastery.nextReviewAt,
    })),
    p_achievements: save.badgeKeys,
  });
  if (error) {
    console.error("Could not save session", error.message);
    return null;
  }
  return typeof data === "number" ? data : null;
}
