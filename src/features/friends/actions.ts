"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { formError, formSuccess, validationError } from "@/lib/forms";
import { createServerSupabase } from "@/lib/supabase/server";
import { friendIdSchema, friendRequestSchema } from "@/schemas/social";
import type { FormState } from "@/types/auth";
import { grantFriendBadges } from "./lib/friend-badges";

function pairFilter(firstId: string, secondId: string): string {
  return (
    `and(requester_id.eq.${firstId},addressee_id.eq.${secondId}),` +
    `and(requester_id.eq.${secondId},addressee_id.eq.${firstId})`
  );
}

export async function sendFriendRequest(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = friendRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createServerSupabase();
  const target = await supabase
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .maybeSingle<Record<"id", string>>();
  if (!target.data) return formError("Aucun utilisateur ne porte ce pseudo.");
  if (target.data.id === user.id) return formError("Vous ne pouvez pas vous ajouter vous-même.");

  const existing = await supabase
    .from("friendships")
    .select("status")
    .or(pairFilter(user.id, target.data.id))
    .maybeSingle<Record<"status", string>>();
  if (existing.data) {
    return formError(
      existing.data.status === "accepted"
        ? "Vous êtes déjà amis."
        : "Une demande est déjà en attente avec cette personne.",
    );
  }

  const { error } = await supabase
    .from("friendships")
    .insert({ requester_id: user.id, addressee_id: target.data.id });
  if (error) return formError("La demande n'a pas pu être envoyée.");
  revalidatePath(ROUTES.friends);
  return formSuccess(`Demande envoyée à ${parsed.data.username}.`);
}

export async function acceptFriendRequest(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = friendIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("friendships")
    .update({ status: "accepted", responded_at: new Date().toISOString() })
    .eq("requester_id", parsed.data.friendId)
    .eq("addressee_id", user.id)
    .select("requester_id");
  if (data && data.length > 0) await grantFriendBadges([user.id, parsed.data.friendId]);
  revalidatePath("/", "layout");
}

/** Declines or cancels a request, or removes an existing friend. */
export async function removeFriendship(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = friendIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createServerSupabase();
  await supabase.from("friendships").delete().or(pairFilter(user.id, parsed.data.friendId));
  revalidatePath(ROUTES.friends);
}
