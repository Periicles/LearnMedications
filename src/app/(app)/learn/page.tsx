import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/features/auth/lib/session";
import { CollectionSection } from "@/features/learn/components/collection-section";
import { ContinueCard } from "@/features/learn/components/continue-card";
import { ReviewCard } from "@/features/learn/components/review-card";
import { listProgress, pickContinue } from "@/features/learn/lib/overview";
import { REVIEW_SESSION_SIZE } from "@/features/progress/constants";
import { pickDue } from "@/features/progress/lib/mastery";
import { getCompletions, getMasteryRows, getProfile } from "@/features/progress/lib/queries";

export const metadata: Metadata = { title: "Apprendre" };

export default async function LearnPage() {
  const user = await requireUser();
  const [profile, completions, masteryRows] = await Promise.all([
    getProfile(user.id),
    getCompletions(user.id),
    getMasteryRows(user.id),
  ]);
  const continueWith = pickContinue(completions);
  const dueCount = pickDue(masteryRows, new Date(), REVIEW_SESSION_SIZE).length;

  return (
    <>
      <PageHeader
        title={`Bonjour ${profile?.username ?? ""} 👋`}
        subtitle="Que voulez-vous apprendre aujourd'hui ?"
      />
      {continueWith ? <ContinueCard progress={continueWith} /> : null}
      <ReviewCard dueCount={dueCount} />
      <CollectionSection title="Pour commencer" items={listProgress(completions, "general")} />
      <CollectionSection title="Par service" items={listProgress(completions, "service")} />
      <CollectionSection title="Par spécialité" items={listProgress(completions, "area")} />
    </>
  );
}
