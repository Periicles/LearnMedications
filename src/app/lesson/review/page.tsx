import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonSkeleton } from "@/features/quiz/components/lesson-skeleton";
import { ReviewScreen } from "@/features/review/components/review-screen";

export const metadata: Metadata = { title: "Révision" };

export default function ReviewSessionPage() {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <ReviewScreen />
    </Suspense>
  );
}
