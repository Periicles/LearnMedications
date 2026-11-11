import { mergeClasses } from "@/lib/class-names";
import type { ProgressBarProps } from "@/types/ui";
import { SOLID_TONE_CLASSES } from "./tones";

export function ProgressBar({
  value,
  total = 100,
  tone = "brand",
  label,
  className,
}: ProgressBarProps) {
  const ratio = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(value, total)}
      className={mergeClasses("bg-surface-muted h-4 overflow-hidden rounded-full", className)}
    >
      <div
        className={mergeClasses(
          "h-full rounded-full transition-[width] duration-500",
          SOLID_TONE_CLASSES[tone],
        )}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
