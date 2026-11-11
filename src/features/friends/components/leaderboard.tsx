import { Flame } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { mergeClasses } from "@/lib/class-names";
import type { LeaderboardProps } from "@/types/social";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <Card>
      <h2 className="text-lg font-black">Classement de la semaine</h2>
      <p className="text-ink-soft text-sm font-semibold">XP gagnés depuis lundi.</p>
      <ol className="mt-3 flex flex-col gap-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={mergeClasses(
              "flex items-center gap-3 rounded-2xl border-2 px-3 py-2",
              entry.isSelf ? "border-brand bg-brand-soft" : "border-line",
            )}
          >
            <span className="w-7 shrink-0 text-center text-lg font-black">
              {MEDALS[entry.rank] ?? entry.rank}
            </span>
            <Avatar emoji={entry.avatar} size="small" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold">
                {entry.username}
                {entry.isSelf ? " (vous)" : ""}
              </p>
              <p className="text-ink-soft text-xs font-bold">
                Niveau {entry.level}
                <Flame className="ml-2 inline size-3.5" aria-hidden="true" /> {entry.streak}
                <span className="sr-only"> {entry.streak > 1 ? "jours" : "jour"} de série</span>
              </p>
            </div>
            <span className="shrink-0 font-black tabular-nums">{entry.weeklyXp} XP</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
