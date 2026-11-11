import type { Mastery } from "@/types/progress";
import type { AnswerRecord } from "@/types/quiz";
import { MASTERED_STRENGTH, MAX_STRENGTH, REVIEW_INTERVAL_DAYS } from "../constants";
import { addDays } from "./dates";

/** A substance counts as failed for the session as soon as one of its answers is wrong. */
export function groupRecords(records: AnswerRecord[]): Map<string, boolean> {
  const results = new Map<string, boolean>();
  for (const record of records) {
    results.set(
      record.substanceSlug,
      (results.get(record.substanceSlug) ?? true) && record.correct,
    );
  }
  return results;
}

export function updateMastery(
  substanceSlug: string,
  current: Mastery | undefined,
  correct: boolean,
  moment: Date,
): Mastery {
  const previous = current?.strength ?? 0;
  const strength = correct ? Math.min(previous + 1, MAX_STRENGTH) : Math.min(previous, 1);
  return {
    substanceSlug,
    strength,
    correctCount: (current?.correctCount ?? 0) + (correct ? 1 : 0),
    wrongCount: (current?.wrongCount ?? 0) + (correct ? 0 : 1),
    nextReviewAt: addDays(moment, REVIEW_INTERVAL_DAYS[strength]).toISOString(),
  };
}

export function applyRecords(
  records: AnswerRecord[],
  known: Map<string, Mastery>,
  moment: Date,
): Mastery[] {
  return [...groupRecords(records)].map(([substanceSlug, correct]) =>
    updateMastery(substanceSlug, known.get(substanceSlug), correct, moment),
  );
}

export function isMastered(mastery: Mastery): boolean {
  return mastery.strength >= MASTERED_STRENGTH;
}

/** Substances due for review, weakest and most overdue first. */
export function pickDue(rows: Mastery[], moment: Date, limit: number): Mastery[] {
  return rows
    .filter((mastery) => Date.parse(mastery.nextReviewAt) <= moment.getTime())
    .sort(
      (left, right) =>
        left.strength - right.strength ||
        Date.parse(left.nextReviewAt) - Date.parse(right.nextReviewAt),
    )
    .slice(0, limit);
}
