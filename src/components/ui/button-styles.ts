import { mergeClasses } from "@/lib/class-names";
import type { ButtonSize, ButtonStyleOptions, ButtonVariant } from "@/types/ui";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-b-4 font-extrabold tracking-wide " +
  "transition-[transform,filter] select-none hover:brightness-105 active:translate-y-0.5 " +
  "active:border-b-2 disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white border-brand-strong",
  accent: "bg-accent text-ink border-accent-strong dark:text-canvas",
  secondary: "bg-surface text-ink border-line border-2 border-b-4",
  ghost: "bg-transparent text-brand border-transparent hover:bg-brand-soft",
  danger: "bg-danger text-white border-danger-strong",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  small: "min-h-10 px-4 text-sm",
  medium: "min-h-12 px-5 text-base",
  large: "min-h-14 px-6 text-lg",
};

export function buttonClasses(options: ButtonStyleOptions): string {
  const { variant = "primary", size = "medium", fullWidth = false, className } = options;
  return mergeClasses(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className,
  );
}
