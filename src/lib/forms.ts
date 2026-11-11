import type { ZodError } from "zod";
import type { FormState } from "@/types/auth";

export const IDLE_FORM_STATE: FormState = { status: "idle" };

/** Reads the given text fields so a form can be re-filled after a failed submission. */
export function pickValues(formData: FormData, fields: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

export function formError(message: string, values?: Record<string, string>): FormState {
  return { status: "error", message, values };
}

export function fieldError(
  field: string,
  message: string,
  values?: Record<string, string>,
): FormState {
  return { status: "error", fieldErrors: { [field]: message }, values };
}

export function formSuccess(message: string): FormState {
  return { status: "success", message };
}

/** Keeps the first validation message of each field. */
export function validationError(error: ZodError, values?: Record<string, string>): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= issue.message;
  }
  return { status: "error", fieldErrors, values };
}
