import type { ZodError } from "zod";
import type { FormState } from "@/types/auth";

export const IDLE_FORM_STATE: FormState = { status: "idle" };

export function formError(message: string): FormState {
  return { status: "error", message };
}

export function formSuccess(message: string): FormState {
  return { status: "success", message };
}

/** Keeps the first validation message of each field. */
export function validationError(error: ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= issue.message;
  }
  return { status: "error", fieldErrors };
}
