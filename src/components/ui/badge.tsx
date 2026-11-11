import { mergeClasses } from "@/lib/class-names";
import type { BadgeProps } from "@/types/ui";
import { SOFT_TONE_CLASSES } from "./tones";

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={mergeClasses(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold",
        SOFT_TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
