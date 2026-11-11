import { findCollection, findLesson, getCatalog } from "@/features/content/lib/catalog";
import type { CompletionMap, SessionInput } from "@/types/progress";
import type { AnswerRecord } from "@/types/quiz";
import { isLessonUnlocked } from "./path";

/** Keeps only the answers that may legitimately count for this session. */
export function acceptRecords(input: SessionInput, completions: CompletionMap): AnswerRecord[] {
  if (input.mode === "review") {
    const { substances } = getCatalog();
    return input.records.filter((record) => substances.has(record.substanceSlug));
  }
  const collection = findCollection(input.collectionSlug ?? "");
  const lesson = findLesson(input.collectionSlug ?? "", input.lessonKey ?? "");
  if (!collection || !lesson || !isLessonUnlocked(collection, lesson.key, completions)) return [];
  return input.records.filter((record) => lesson.substanceSlugs.includes(record.substanceSlug));
}
