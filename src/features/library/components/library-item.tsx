import { Badge } from "@/components/ui/badge";
import { MAX_STRENGTH } from "@/features/progress/constants";
import type { LibraryItemProps } from "@/types/library";

export function LibraryItem({ entry }: LibraryItemProps) {
  return (
    <li className="border-line bg-surface flex flex-col gap-1.5 rounded-2xl border-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="min-w-0 text-lg leading-tight font-extrabold break-words">{entry.name}</h2>
        {entry.strength === null ? null : (
          <Badge tone="brand" className="shrink-0">
            Maîtrise {entry.strength}/{MAX_STRENGTH}
          </Badge>
        )}
      </div>
      {entry.brands.length > 0 ? (
        <p className="text-accent-strong dark:text-accent text-sm font-extrabold">
          {entry.brands.join(" · ")}
        </p>
      ) : null}
      <p className="text-sm font-bold">
        {entry.areaIcon} {entry.className}
      </p>
      <p className="text-ink-soft text-sm font-medium">{entry.hint}</p>
    </li>
  );
}
