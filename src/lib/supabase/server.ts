import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";
import type { CookieToSet } from "@/types/auth";

/** Supabase client bound to the request cookies; queries run with the signed-in user's rights. */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  const { projectUrl, publishableKey } = getSupabaseEnv();

  return createServerClient(projectUrl, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: CookieToSet[]) => {
        try {
          cookiesToSet.forEach((cookie) =>
            cookieStore.set(cookie.name, cookie.value, cookie.options),
          );
        } catch {
          // Server Components cannot write cookies; the proxy refreshes the session instead.
        }
      },
    },
  });
}
