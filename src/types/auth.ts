import type { ReactNode } from "react";

export interface SessionUser {
  id: string;
  email: string;
}

export type FormStatus = "idle" | "error" | "success";

export interface FormState {
  status: FormStatus;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values echoed back so fields keep their content after an error. Never passwords. */
  values?: Record<string, string>;
}

export type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel?: string;
}

export interface SupabaseEnv {
  projectUrl: string;
  publishableKey: string;
}

export interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}
