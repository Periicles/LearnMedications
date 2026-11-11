import { useId } from "react";
import { mergeClasses } from "@/lib/class-names";
import type { TextFieldProps } from "@/types/ui";

export function TextField({ label, error, hint, className, ...inputProps }: TextFieldProps) {
  const fieldId = useId();
  const helpId = `${fieldId}-help`;
  const helpText = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={helpText ? helpId : undefined}
        className={mergeClasses(
          "bg-surface min-h-12 rounded-2xl border-2 px-4 text-base font-semibold",
          "placeholder:text-ink-soft/70 placeholder:font-medium",
          error ? "border-danger" : "border-line focus:border-brand",
          className,
        )}
        {...inputProps}
      />
      {helpText ? (
        <p
          id={helpId}
          className={mergeClasses("text-sm", error ? "text-danger font-bold" : "text-ink-soft")}
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
