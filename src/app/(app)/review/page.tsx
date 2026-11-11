import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ROUTES } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { pickDue } from "@/features/progress/lib/mastery";
import { getMasteryRows } from "@/features/progress/lib/queries";
import { StrengthChart } from "@/features/review/components/strength-chart";

export const metadata: Metadata = { title: "Réviser" };

export default async function ReviewPage() {
  const user = await requireUser();
  const rows = await getMasteryRows(user.id);
  const dueCount = pickDue(rows, new Date(), rows.length).length;

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Dumbbell}
        title="Rien à réviser pour l'instant"
        description="Terminez une première leçon : les molécules apprises reviendront ici au bon moment."
      >
        <ButtonLink href={ROUTES.learn}>Commencer une leçon</ButtonLink>
      </EmptyState>
    );
  }

  return (
    <>
      <PageHeader
        title="Réviser"
        subtitle="La répétition espacée ramène chaque molécule juste avant l'oubli."
      />
      <Card className="flex flex-col gap-3">
        <p className="text-lg font-extrabold">
          {dueCount > 0
            ? `${dueCount} ${dueCount > 1 ? "molécules sont" : "molécule est"} à réviser`
            : "Vous êtes à jour ! Entraînement libre sur vos points faibles."}
        </p>
        <ButtonLink href={ROUTES.reviewSession} variant="accent" size="large" fullWidth>
          {dueCount > 0 ? "Lancer la révision" : "S'entraîner"}
        </ButtonLink>
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-black">{rows.length} molécules rencontrées</h2>
        <StrengthChart rows={rows} />
      </Card>
    </>
  );
}
