import { Dumbbell } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export function ReviewCard({ dueCount }: Record<"dueCount", number>) {
  if (dueCount === 0) return null;

  return (
    <Card className="flex items-center gap-3">
      <span className="bg-accent-soft text-accent-strong dark:text-accent flex size-12 shrink-0 items-center justify-center rounded-2xl">
        <Dumbbell className="size-6" aria-hidden="true" />
      </span>
      <p className="min-w-0 flex-1 font-extrabold">
        {dueCount} {dueCount > 1 ? "molécules à réviser" : "molécule à réviser"}
      </p>
      <ButtonLink href={ROUTES.reviewSession} variant="accent" size="small">
        Réviser
      </ButtonLink>
    </Card>
  );
}
