import { ButtonLink } from "@/components/ui/button";
import type { LessonSummaryProps } from "@/types/quiz";

function pickHeadline(accuracy: number): [string, string] {
  if (accuracy === 1) return ["🏆", "Sans faute !"];
  if (accuracy >= 0.8) return ["🎉", "Très bien joué !"];
  if (accuracy >= 0.5) return ["💪", "Leçon terminée !"];
  return ["🌱", "Continuez, ça vient !"];
}

export function LessonSummary({ outcome, exitHref, children }: LessonSummaryProps) {
  const [emoji, headline] = pickHeadline(outcome.accuracy);

  return (
    <div className="animate-pop flex flex-1 flex-col items-center gap-6 pt-8 text-center">
      <span className="text-7xl" aria-hidden="true">
        {emoji}
      </span>
      <h1 className="text-3xl font-black">{headline}</h1>
      <dl className="grid w-full grid-cols-2 gap-3">
        <div className="border-brand bg-brand-soft rounded-2xl border-2 p-4">
          <dt className="text-sm font-bold">Précision</dt>
          <dd className="text-3xl font-black">{Math.round(outcome.accuracy * 100)} %</dd>
        </div>
        <div className="border-accent bg-accent-soft rounded-2xl border-2 p-4">
          <dt className="text-sm font-bold">Bonnes réponses</dt>
          <dd className="text-3xl font-black">
            {outcome.correctCount}/{outcome.totalCount}
          </dd>
        </div>
      </dl>
      {children}
      <div className="mt-auto w-full pb-[max(1rem,env(safe-area-inset-bottom))]">
        <ButtonLink href={exitHref} size="large" fullWidth>
          Continuer
        </ButtonLink>
      </div>
    </div>
  );
}
