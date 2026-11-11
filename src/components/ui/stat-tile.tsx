import { mergeClasses } from "@/lib/class-names";
import type { StatTileProps } from "@/types/ui";
import { SOFT_TONE_CLASSES } from "./tones";

export function StatTile({ label, value, icon: Icon, tone = "brand" }: StatTileProps) {
  return (
    <div className="border-line bg-surface flex items-center gap-3 rounded-2xl border-2 p-3">
      <span
        className={mergeClasses(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          SOFT_TONE_CLASSES[tone],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg leading-tight font-extrabold">{value}</p>
        <p className="text-ink-soft truncate text-xs font-bold">{label}</p>
      </div>
    </div>
  );
}
