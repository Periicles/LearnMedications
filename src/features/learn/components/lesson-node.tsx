import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { mergeClasses } from "@/lib/class-names";
import type { LessonNodeProps, LessonStatus } from "@/types/progress";

const BUBBLE_CLASSES: Record<LessonStatus, string> = {
  completed: "bg-brand border-brand-strong text-white",
  current: "bg-accent border-accent-strong text-ink dark:text-canvas",
  locked: "bg-surface-muted border-line text-ink-soft",
};

const HINTS: Record<LessonStatus, string> = {
  completed: "Terminée · refaire",
  current: "À vous de jouer",
  locked: "Terminez la leçon précédente",
};

export function LessonNodeView({ node, href, position }: LessonNodeProps) {
  const { lesson, status } = node;
  const content = (
    <>
      <span
        className={mergeClasses(
          "flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-b-4 text-lg font-black",
          BUBBLE_CLASSES[status],
        )}
      >
        {status === "completed" ? <Check className="size-6" aria-hidden="true" /> : null}
        {status === "locked" ? <Lock className="size-5" aria-hidden="true" /> : null}
        {status === "current" ? position : null}
      </span>
      <span className="min-w-0">
        <span className="block leading-tight font-extrabold">{lesson.title}</span>
        <span className="text-ink-soft block text-xs font-bold">
          {lesson.substanceSlugs.length} molécules · {HINTS[status]}
        </span>
      </span>
    </>
  );
  const baseClasses = "flex items-center gap-3 rounded-3xl border-2 p-3";

  if (status === "locked") {
    return (
      <div aria-disabled="true" className={mergeClasses(baseClasses, "border-line opacity-60")}>
        {content}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className={mergeClasses(
        baseClasses,
        "bg-surface border-b-4 transition-colors",
        status === "current" ? "border-accent" : "border-line hover:border-brand",
      )}
    >
      {content}
    </Link>
  );
}
