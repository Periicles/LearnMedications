import type { PlanMode, SessionOutcome } from "@/types/quiz";
import { LESSON_BASE_XP, MAX_ANSWER_XP, PERFECT_BONUS_XP, REVIEW_BASE_XP } from "../constants";

/** Base XP for finishing, one point per correct answer and a bonus for a flawless session. */
export function computeSessionXp(outcome: SessionOutcome, mode: PlanMode): number {
  if (outcome.totalCount === 0) return 0;
  const baseXp = mode === "learn" ? LESSON_BASE_XP : REVIEW_BASE_XP;
  const answerXp = Math.min(outcome.correctCount, MAX_ANSWER_XP);
  return baseXp + answerXp + (outcome.perfect ? PERFECT_BONUS_XP : 0);
}
