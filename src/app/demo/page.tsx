import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonSkeleton } from "@/features/quiz/components/lesson-skeleton";
import { DemoLesson } from "@/features/demo/components/demo-lesson";

export const metadata: Metadata = { title: "Leçon d'essai" };

export default function DemoPage() {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <DemoLesson />
    </Suspense>
  );
}
