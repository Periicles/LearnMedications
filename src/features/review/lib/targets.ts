import { REVIEW_SESSION_SIZE } from "@/features/progress/constants";
import { pickDue } from "@/features/progress/lib/mastery";
import type { Mastery } from "@/types/progress";

/** Due substances first; when nothing is due, the weakest known ones for free practice. */
export function pickReviewTargets(rows: Mastery[], moment: Date): string[] {
  const dueRows = pickDue(rows, moment, REVIEW_SESSION_SIZE);
  const chosen =
    dueRows.length > 0
      ? dueRows
      : [...rows]
          .sort((left, right) => left.strength - right.strength)
          .slice(0, REVIEW_SESSION_SIZE);
  return chosen.map((mastery) => mastery.substanceSlug);
}
