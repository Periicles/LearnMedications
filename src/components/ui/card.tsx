import { mergeClasses } from "@/lib/class-names";
import type { CardProps } from "@/types/ui";

export function Card({ children, className }: CardProps) {
  return (
    <div className={mergeClasses("border-line bg-surface rounded-3xl border-2 p-5", className)}>
      {children}
    </div>
  );
}
