import type { FormState } from "@/types/auth";
import { Notice } from "./notice";

export function FormMessage({ state }: Record<"state", FormState>) {
  if (!state.message) return null;
  return <Notice tone={state.status === "success" ? "brand" : "danger"}>{state.message}</Notice>;
}
