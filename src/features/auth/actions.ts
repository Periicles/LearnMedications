"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getSiteUrl } from "@/lib/env";
import { formError, formSuccess, validationError } from "@/lib/forms";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/schemas/auth";
import type { FormState } from "@/types/auth";
import { describeAuthError } from "./lib/errors";

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return formError(describeAuthError(error.code));
  redirect(ROUTES.learn);
}

export async function signup(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  const { username, email, password } = parsed.data;
  const supabase = await createServerSupabase();

  const availability = await supabase.rpc("is_username_available", { wanted: username });
  if (availability.data === false) {
    return { status: "error", fieldErrors: { username: "Ce pseudo est déjà pris." } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username }, emailRedirectTo: `${getSiteUrl()}/auth/confirm` },
  });
  if (error) return formError(describeAuthError(error.code));
  if (data.session) redirect(ROUTES.learn);
  return formSuccess("Compte créé ! Cliquez sur le lien reçu par e-mail pour l'activer.");
}

export async function requestPasswordReset(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  const supabase = await createServerSupabase();
  const redirectTo = `${getSiteUrl()}/auth/confirm?next=${ROUTES.resetPassword}`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
  if (error) return formError(describeAuthError(error.code));
  return formSuccess("Si un compte existe pour cette adresse, un e-mail vient d'être envoyé.");
}

export async function updatePassword(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return formError(describeAuthError(error.code));
  redirect(ROUTES.learn);
}

export async function logout(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect(ROUTES.home);
}
