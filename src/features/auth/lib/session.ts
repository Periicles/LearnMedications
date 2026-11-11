import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ROUTES } from "@/constants/routes";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SessionUser } from "@/types/auth";

/** Reads and verifies the session once per request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : "" };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);
  return user;
}
