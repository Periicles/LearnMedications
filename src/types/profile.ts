import type { AchievementStats, SessionStats } from "./achievements";
import type { Profile } from "./progress";

export interface DailyXpRow {
  day: string;
  xp: number;
}

export interface DailyPoint {
  day: string;
  label: string;
  xp: number;
}

export interface AreaMastery {
  slug: string;
  name: string;
  icon: string;
  learnedCount: number;
  masteredCount: number;
  totalCount: number;
}

export interface ProfileHeaderProps {
  profile: Profile;
}

export interface StatsGridProps {
  profile: Profile;
  stats: AchievementStats;
  sessions: SessionStats;
  visibleStreak: number;
}

export interface XpChartProps {
  points: DailyPoint[];
}

export interface AreaMasteryListProps {
  areas: AreaMastery[];
}

export interface ProfileFormProps {
  username: string;
  avatar: string;
}

export interface AvatarPickerProps {
  selected: string;
}

export interface DeleteAccountProps {
  username: string;
}
