import { notFound, redirect } from "next/navigation";
import { collectionRoute } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { findCollection, getCatalog, pickSubstances } from "@/features/content/lib/catalog";
import { TrackedLesson } from "@/features/progress/components/tracked-lesson";
import { isLessonUnlocked } from "@/features/progress/lib/path";
import { getCompletions } from "@/features/progress/lib/queries";
import { buildLessonPlan } from "@/features/quiz/lib/plan";
import type { LessonScreenProps } from "@/types/progress";

export async function LessonScreen({ params }: LessonScreenProps) {
  const { collection: collectionSlug, lesson: lessonKey } = await params;
  const user = await requireUser();
  const collection = findCollection(collectionSlug);
  const lesson = collection?.lessons.find((candidate) => candidate.key === lessonKey);
  if (!collection || !lesson) notFound();

  const exitHref = collectionRoute(collection.slug);
  if (!isLessonUnlocked(collection, lesson.key, await getCompletions(user.id))) redirect(exitHref);

  const targets = pickSubstances(lesson.substanceSlugs);
  const plan = buildLessonPlan(lesson.title, targets, getCatalog(), "learn");

  return (
    <TrackedLesson
      plan={plan}
      exitHref={exitHref}
      context={{ mode: "learn", collectionSlug: collection.slug, lessonKey: lesson.key }}
    />
  );
}
