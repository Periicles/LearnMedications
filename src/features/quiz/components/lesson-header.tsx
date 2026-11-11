import Link from "next/link";
import { X } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { LessonHeaderProps } from "@/types/quiz";

export function LessonHeader({ exitHref, progress }: LessonHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
      <Link
        href={exitHref}
        aria-label="Quitter la leçon"
        className="text-ink-soft hover:bg-surface-muted flex size-10 shrink-0 items-center justify-center rounded-full"
      >
        <X className="size-6" aria-hidden="true" />
      </Link>
      <ProgressBar
        value={Math.round(progress * 100)}
        label="Progression de la leçon"
        className="flex-1"
      />
    </header>
  );
}
