import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AchievementCard } from "@/features/achievements/components/achievement-card";
import { buildAchievementViews } from "@/features/achievements/lib/evaluate";
import { loadAchievementStats } from "@/features/achievements/lib/overview";
import { getUnlockedAchievements } from "@/features/achievements/lib/queries";
import { requireUser } from "@/features/auth/lib/session";

export const metadata: Metadata = { title: "Succès" };

export default async function AchievementsPage() {
  const user = await requireUser();
  const [stats, unlocked] = await Promise.all([
    loadAchievementStats(user.id, 0),
    getUnlockedAchievements(user.id),
  ]);
  if (!stats) return null;
  const views = buildAchievementViews(stats, unlocked);
  const unlockedCount = views.filter((view) => view.unlockedAt !== null).length;

  return (
    <>
      <PageHeader title="Succès" subtitle={`${unlockedCount} sur ${views.length} débloqués`} />
      <ProgressBar
        value={unlockedCount}
        total={views.length}
        tone="accent"
        label="Succès débloqués"
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {views.map((view) => (
          <li key={view.achievement.key}>
            <AchievementCard view={view} />
          </li>
        ))}
      </ul>
    </>
  );
}
