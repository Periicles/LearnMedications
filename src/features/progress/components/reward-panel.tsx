import { Flame, Zap } from "lucide-react";
import { Notice } from "@/components/ui/notice";
import { Skeleton } from "@/components/ui/skeleton";
import type { RewardPanelProps } from "@/types/progress";

export function RewardPanel({ state }: RewardPanelProps) {
  if (state.status === "pending") return <Skeleton className="h-20 w-full" />;
  if (state.status === "failed") {
    return <Notice tone="danger">Vos résultats n&apos;ont pas pu être enregistrés.</Notice>;
  }
  const { reward } = state;

  return (
    <div className="flex w-full flex-col gap-3">
      <dl className="grid grid-cols-2 gap-3">
        <div className="border-accent bg-accent-soft animate-pop rounded-2xl border-2 p-4">
          <dt className="flex items-center justify-center gap-1 text-sm font-bold">
            <Zap className="size-4" aria-hidden="true" /> XP gagnés
          </dt>
          <dd className="text-3xl font-black">+{reward.xpGained}</dd>
        </div>
        <div className="border-danger bg-danger-soft animate-pop rounded-2xl border-2 p-4">
          <dt className="flex items-center justify-center gap-1 text-sm font-bold">
            <Flame className="size-4" aria-hidden="true" /> Série
          </dt>
          <dd className="text-3xl font-black">
            {reward.streak} {reward.streak > 1 ? "jours" : "jour"}
          </dd>
        </div>
      </dl>
      {reward.leveledUp ? <Notice tone="brand">🎉 Niveau {reward.level} atteint !</Notice> : null}
      {reward.badges.map((badge) => (
        <Notice key={badge.key} tone="accent">
          {badge.icon} Succès débloqué : {badge.title}
        </Notice>
      ))}
    </div>
  );
}
