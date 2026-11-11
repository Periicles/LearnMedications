import { BookCheck, Brain, Crosshair, Flame, Medal, Sparkles, Zap } from "lucide-react";
import { StatTile } from "@/components/ui/stat-tile";
import type { StatsGridProps } from "@/types/profile";

export function StatsGrid({ profile, stats, sessions, visibleStreak }: StatsGridProps) {
  const accuracy =
    sessions.answerCount > 0
      ? `${Math.round((sessions.correctCount / sessions.answerCount) * 100)} %`
      : "–";

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Statistiques">
      <StatTile icon={Flame} tone="danger" label="Série actuelle" value={visibleStreak} />
      <StatTile icon={Medal} tone="accent" label="Meilleure série" value={profile.longestStreak} />
      <StatTile icon={Zap} tone="accent" label="XP total" value={profile.totalXp} />
      <StatTile icon={BookCheck} label="Leçons terminées" value={stats.lessonCount} />
      <StatTile icon={Sparkles} tone="info" label="Molécules vues" value={stats.learnedCount} />
      <StatTile icon={Brain} label="Molécules maîtrisées" value={stats.masteredCount} />
      <StatTile icon={Crosshair} tone="info" label="Précision" value={accuracy} />
    </section>
  );
}
