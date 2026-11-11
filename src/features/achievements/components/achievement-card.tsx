import { ProgressBar } from "@/components/ui/progress-bar";
import { mergeClasses } from "@/lib/class-names";
import type { AchievementCardProps } from "@/types/achievements";

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export function AchievementCard({ view }: AchievementCardProps) {
  const { achievement, unlockedAt, current } = view;
  const isUnlocked = unlockedAt !== null;

  return (
    <div
      className={mergeClasses(
        "flex h-full items-center gap-3 rounded-3xl border-2 p-4",
        isUnlocked ? "border-accent bg-accent-soft" : "border-line bg-surface",
      )}
    >
      <span
        className={mergeClasses(
          "bg-surface flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
          !isUnlocked && "opacity-40 grayscale",
        )}
        aria-hidden="true"
      >
        {achievement.icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="leading-tight font-extrabold">{achievement.title}</h3>
        <p className="text-ink-soft text-sm font-semibold">{achievement.description}</p>
        {isUnlocked ? (
          <p className="text-accent-strong dark:text-accent text-xs font-extrabold">
            Débloqué le {DATE_FORMAT.format(new Date(unlockedAt))}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <ProgressBar
              value={current}
              total={achievement.threshold}
              tone="accent"
              label={`Progression : ${achievement.title}`}
              className="h-2.5 flex-1"
            />
            <span className="text-ink-soft text-xs font-extrabold tabular-nums">
              {current}/{achievement.threshold}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
