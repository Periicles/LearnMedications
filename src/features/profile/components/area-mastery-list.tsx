import { Card } from "@/components/ui/card";
import type { AreaMasteryListProps } from "@/types/profile";

export function AreaMasteryList({ areas }: AreaMasteryListProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-black">Maîtrise par spécialité</h2>
        <p className="text-ink-soft text-sm font-semibold">
          Molécules maîtrisées (foncé) et rencontrées (clair).
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {areas.map((area) => (
          <li key={area.slug} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2 text-sm font-bold">
              <span className="truncate">
                {area.icon} {area.name}
              </span>
              <span className="text-ink-soft shrink-0 tabular-nums">
                {area.masteredCount}/{area.totalCount}
              </span>
            </div>
            <div className="bg-surface-muted relative h-3 overflow-hidden rounded-full">
              <span
                className="bg-brand/35 absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${(area.learnedCount / area.totalCount) * 100}%` }}
              />
              <span
                className="bg-brand absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${(area.masteredCount / area.totalCount) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
