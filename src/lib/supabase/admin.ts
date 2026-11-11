import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSecretKey, getSupabaseEnv } from "@/lib/env";

/** Privileged client that bypasses row level security. Server-side writes only. */
export function createAdminSupabase() {
  return createClient(getSupabaseEnv().projectUrl, getSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
