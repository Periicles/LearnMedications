import { mergeClasses } from "@/lib/class-names";
import type { MatchTileProps } from "@/types/quiz";

const STATE_CLASSES: Record<MatchTileProps["state"], string> = {
  idle: "border-line bg-surface hover:bg-surface-muted",
  selected: "border-info bg-info-soft",
  matched: "border-brand bg-brand-soft opacity-60",
  wrong: "border-danger bg-danger-soft animate-shake",
};

export function MatchTile({ label, state, onSelect }: MatchTileProps) {
  return (
    <button
      type="button"
      disabled={state === "matched"}
      aria-pressed={state === "selected"}
      onClick={onSelect}
      className={mergeClasses(
        "flex min-h-16 w-full items-center justify-center rounded-2xl border-2 border-b-4 px-2 py-2 text-center text-sm font-bold break-words",
        "transition-transform active:translate-y-0.5 active:border-b-2 sm:text-base",
        STATE_CLASSES[state],
      )}
    >
      {label}
    </button>
  );
}
