import { mergeClasses } from "@/lib/class-names";
import type { ChoiceButtonProps } from "@/types/quiz";

const STATE_CLASSES: Record<ChoiceButtonProps["state"], string> = {
  idle: "border-line bg-surface hover:bg-surface-muted",
  correct: "border-brand bg-brand-soft",
  wrong: "border-danger bg-danger-soft animate-shake",
  dimmed: "border-line bg-surface opacity-50",
};

export function ChoiceButton({ label, shortcut, state, disabled, onSelect }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={mergeClasses(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-bold",
        "transition-transform active:translate-y-0.5 active:border-b-2",
        STATE_CLASSES[state],
      )}
    >
      <span className="border-line text-ink-soft hidden size-7 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-extrabold sm:flex">
        {shortcut}
      </span>
      <span className="min-w-0 break-words">{label}</span>
    </button>
  );
}
