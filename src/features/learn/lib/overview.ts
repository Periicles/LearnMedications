import { getCatalog } from "@/features/content/lib/catalog";
import { summarizeCollection } from "@/features/progress/lib/path";
import type { CollectionKind } from "@/types/content";
import type { CollectionProgress, CompletionMap } from "@/types/progress";

export function listProgress(
  completions: CompletionMap,
  kind: CollectionKind,
): CollectionProgress[] {
  return getCatalog()
    .collections.filter((collection) => collection.kind === kind)
    .map((collection) => summarizeCollection(collection, completions));
}

/** The most advanced unfinished collection, or the essentials for a new learner. */
export function pickContinue(completions: CompletionMap): CollectionProgress | null {
  const summaries = getCatalog().collections.map((collection) =>
    summarizeCollection(collection, completions),
  );
  const unfinished = summaries.filter((summary) => summary.nextLesson !== null);
  const started = unfinished
    .filter((summary) => summary.completedCount > 0)
    .sort((left, right) => right.completedCount - left.completedCount);
  return started[0] ?? unfinished[0] ?? null;
}
