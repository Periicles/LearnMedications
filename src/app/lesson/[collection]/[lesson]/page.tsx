import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonScreen } from "@/features/learn/components/lesson-screen";
import { LessonSkeleton } from "@/features/quiz/components/lesson-skeleton";

export const metadata: Metadata = { title: "Leçon" };

export default function LessonPage(props: PageProps<"/lesson/[collection]/[lesson]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonScreen params={props.params} />
    </Suspense>
  );
}
