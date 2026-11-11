import { connection } from "next/server";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getCatalog, pickSubstances } from "@/features/content/lib/catalog";
import { LessonPlayer } from "@/features/quiz/components/lesson-player";
import { buildLessonPlan } from "@/features/quiz/lib/plan";

export async function DemoLesson() {
  await connection();
  const catalog = getCatalog();
  const [lesson] = catalog.collections[0].lessons;
  const targets = pickSubstances(lesson.substanceSlugs);
  const plan = buildLessonPlan(lesson.title, targets, catalog, "learn");

  return (
    <LessonPlayer
      plan={plan}
      exitHref={ROUTES.home}
      summaryFooter={
        <div className="flex w-full flex-col gap-2">
          <p className="text-ink-soft font-semibold">
            Créez un compte pour enregistrer vos progrès, gagner de l&apos;XP et débloquer tous les
            parcours.
          </p>
          <ButtonLink href={ROUTES.signup} variant="accent" size="large" fullWidth>
            Créer mon compte
          </ButtonLink>
        </div>
      }
    />
  );
}
