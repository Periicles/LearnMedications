import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { getCatalog, pickSubstances } from "@/features/content/lib/catalog";
import { TrackedLesson } from "@/features/progress/components/tracked-lesson";
import { getMasteryRows } from "@/features/progress/lib/queries";
import { buildLessonPlan } from "@/features/quiz/lib/plan";
import { pickReviewTargets } from "../lib/targets";

export async function ReviewScreen() {
  const user = await requireUser();
  const targets = pickSubstances(pickReviewTargets(await getMasteryRows(user.id), new Date()));
  if (targets.length === 0) redirect(ROUTES.review);
  const plan = buildLessonPlan("Révision", targets, getCatalog(), "review");

  return <TrackedLesson plan={plan} exitHref={ROUTES.review} context={{ mode: "review" }} />;
}
