import type { Metadata } from "next";
import { loadAchievementStats } from "@/features/achievements/lib/overview";
import { getSessionStats } from "@/features/achievements/lib/queries";
import { getFriendCount } from "@/features/friends/lib/queries";
import { requireUser } from "@/features/auth/lib/session";
import { getCatalog } from "@/features/content/lib/catalog";
import { AreaMasteryList } from "@/features/profile/components/area-mastery-list";
import { DeleteAccount } from "@/features/profile/components/delete-account";
import { LogoutButton } from "@/features/profile/components/logout-button";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { StatsGrid } from "@/features/profile/components/stats-grid";
import { XpChart } from "@/features/profile/components/xp-chart";
import { CHART_DAYS } from "@/features/profile/constants";
import { buildAreaMastery } from "@/features/profile/lib/areas";
import { buildDailySeries } from "@/features/profile/lib/chart";
import { getDailyXp } from "@/features/profile/lib/queries";
import { toLocalDay } from "@/features/progress/lib/dates";
import { getMasteryRows, getProfile } from "@/features/progress/lib/queries";
import { visibleStreak } from "@/features/progress/lib/streak";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const user = await requireUser();
  const [profile, stats, sessions, mastery, dailyXp] = await Promise.all([
    getProfile(user.id),
    loadAchievementStats(user.id, await getFriendCount()),
    getSessionStats(),
    getMasteryRows(user.id),
    getDailyXp(CHART_DAYS),
  ]);
  if (!profile || !stats) return null;
  const today = toLocalDay(new Date());

  return (
    <>
      <ProfileHeader profile={profile} />
      <StatsGrid
        profile={profile}
        stats={stats}
        sessions={sessions}
        visibleStreak={visibleStreak(profile, today)}
      />
      <XpChart points={buildDailySeries(today, CHART_DAYS, dailyXp)} />
      <AreaMasteryList areas={buildAreaMastery(getCatalog(), mastery)} />
      <ProfileForm username={profile.username} avatar={profile.avatar} />
      <LogoutButton />
      <DeleteAccount username={profile.username} />
    </>
  );
}
