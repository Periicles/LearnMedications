import type { Tone } from "@/types/ui";

export const SOFT_TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand-strong dark:text-brand",
  accent: "bg-accent-soft text-accent-strong dark:text-accent",
  danger: "bg-danger-soft text-danger-strong dark:text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-muted text-ink-soft",
};

export const SOLID_TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand",
  accent: "bg-accent",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-ink-soft",
};
