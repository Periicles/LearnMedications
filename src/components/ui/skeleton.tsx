import { mergeClasses } from "@/lib/class-names";
import type { CardProps } from "@/types/ui";

export function Skeleton({ className }: Pick<CardProps, "className">) {
  return <div className={mergeClasses("bg-surface-muted animate-pulse rounded-2xl", className)} />;
}
