import { mergeClasses } from "@/lib/class-names";
import type { AvatarProps, AvatarSize } from "@/types/ui";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  small: "size-9 text-lg",
  medium: "size-12 text-2xl",
  large: "size-20 text-4xl",
};

export function Avatar({ emoji, size = "medium", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={mergeClasses(
        "bg-brand-soft border-brand inline-flex shrink-0 items-center justify-center rounded-full border-2",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {emoji}
    </span>
  );
}
