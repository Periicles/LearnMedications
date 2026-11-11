"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { getProfile } from "@/features/progress/lib/queries";
import { formError, formSuccess, validationError } from "@/lib/forms";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { deleteAccountSchema, profileSchema } from "@/schemas/profile";
import type { FormState } from "@/types/auth";

const UNIQUE_VIOLATION = "23505";

export async function updateProfile(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error?.code === UNIQUE_VIOLATION) {
    return { status: "error", fieldErrors: { username: "Ce pseudo est déjà pris." } };
  }
  if (error) return formError("Le profil n'a pas pu être enregistré.");

  revalidatePath("/", "layout");
  return formSuccess("Profil mis à jour.");
}

/** Permanently deletes the account; every related row is removed by cascade. */
export async function deleteAccount(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const parsed = deleteAccountSchema.safeParse(Object.fromEntries(formData));
  if (!profile || !parsed.success || parsed.data.confirmation !== profile.username) {
    return { status: "error", fieldErrors: { confirmation: "Saisissez votre pseudo exact." } };
  }

  const { error } = await createAdminSupabase().auth.admin.deleteUser(user.id);
  if (error) return formError("Le compte n'a pas pu être supprimé.");
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect(ROUTES.home);
}
