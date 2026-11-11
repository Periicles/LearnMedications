import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { levelProgress } from "@/features/progress/lib/levels";
import type { ProfileHeaderProps } from "@/types/profile";

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const progress = levelProgress(profile.totalXp);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar emoji={profile.avatar} size="large" />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black">{profile.username}</h1>
          <p className="text-ink-soft text-sm font-bold">
            Membre depuis {DATE_FORMAT.format(new Date(profile.createdAt))}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-sm font-extrabold">
          <span>Niveau {progress.level}</span>
          <span className="text-ink-soft">
            {progress.earnedInLevel}/{progress.neededForNext} XP
          </span>
        </div>
        <ProgressBar
          value={progress.earnedInLevel}
          total={progress.neededForNext}
          tone="accent"
          label={`Progression vers le niveau ${progress.level + 1}`}
        />
      </div>
    </Card>
  );
}
