import { Card } from "@/components/ui/card";
import type { XpChartProps } from "@/types/profile";

export function XpChart({ points }: XpChartProps) {
  const highest = Math.max(...points.map((point) => point.xp), 1);
  const totalXp = points.reduce((subtotal, point) => subtotal + point.xp, 0);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-black">{points.length} derniers jours</h2>
        <p className="text-ink-soft text-sm font-extrabold">{totalXp} XP</p>
      </div>
      <ol className="flex h-36 items-end gap-1" aria-label="XP gagnés par jour">
        {points.map((point) => (
          <li key={point.day} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1">
            <span className="text-ink-soft text-[0.625rem] font-extrabold tabular-nums">
              {point.xp > 0 ? point.xp : ""}
            </span>
            <span className="bg-surface-muted flex w-full flex-1 items-end overflow-hidden rounded-lg">
              <span
                className="bg-accent block w-full rounded-lg"
                style={{ height: `${(point.xp / highest) * 100}%` }}
              />
            </span>
            <span className="text-ink-soft text-xs font-bold" aria-hidden="true">
              {point.label}
            </span>
            <span className="sr-only">
              {point.day} : {point.xp} XP
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
