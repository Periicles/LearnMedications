import { MAX_STRENGTH } from "@/features/progress/constants";
import type { Mastery } from "@/types/progress";

const STRENGTH_LABELS = ["À revoir", "Fragile", "En cours", "Solide", "Maîtrisé", "Acquis"];

export function StrengthChart({ rows }: Record<"rows", Mastery[]>) {
  const counts = Array.from(
    { length: MAX_STRENGTH + 1 },
    (_unused, strength) => rows.filter((mastery) => mastery.strength === strength).length,
  );
  const highest = Math.max(...counts, 1);

  return (
    <ul className="flex flex-col gap-2" aria-label="Répartition par niveau de maîtrise">
      {counts.map((count, strength) => (
        <li key={STRENGTH_LABELS[strength]} className="flex items-center gap-3 text-sm font-bold">
          <span className="w-20 shrink-0">{STRENGTH_LABELS[strength]}</span>
          <span className="bg-surface-muted h-4 flex-1 overflow-hidden rounded-full">
            <span
              className="bg-brand block h-full rounded-full"
              style={{ width: `${(count / highest) * 100}%`, opacity: 0.4 + strength * 0.12 }}
            />
          </span>
          <span className="w-8 text-right tabular-nums">{count}</span>
        </li>
      ))}
    </ul>
  );
}
