import type { Area, Collection } from "@/types/content";
import type { CollectionProgress, CompletionMap, LessonNode } from "@/types/progress";

/** Lessons unlock in order: the first lesson not yet completed is the current one. */
export function buildLessonNodes(
  collection: Collection,
  completions: CompletionMap,
  areas: Area[],
): LessonNode[] {
  const completed = completions.get(collection.slug) ?? new Set<string>();
  const currentIndex = collection.lessons.findIndex((lesson) => !completed.has(lesson.key));
  return collection.lessons.map((lesson, index) => ({
    lesson,
    areaName: areas.find((area) => area.slug === lesson.areaSlug)?.name ?? "",
    status: completed.has(lesson.key) ? "completed" : index === currentIndex ? "current" : "locked",
  }));
}

export function summarizeCollection(
  collection: Collection,
  completions: CompletionMap,
): CollectionProgress {
  const completed = completions.get(collection.slug) ?? new Set<string>();
  return {
    collection,
    completedCount: collection.lessons.filter((lesson) => completed.has(lesson.key)).length,
    nextLesson: collection.lessons.find((lesson) => !completed.has(lesson.key)) ?? null,
  };
}

export function isLessonUnlocked(
  collection: Collection,
  lessonKey: string,
  completions: CompletionMap,
): boolean {
  const completed = completions.get(collection.slug) ?? new Set<string>();
  const firstOpen = collection.lessons.find((lesson) => !completed.has(lesson.key));
  return completed.has(lessonKey) || firstOpen?.key === lessonKey;
}
