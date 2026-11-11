import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { CookieToSet } from "@/types/auth";

const GUEST_ONLY_PATHS: string[] = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword];
const PUBLIC_PATHS: string[] = [
  ROUTES.home,
  ROUTES.demo,
  ROUTES.resetPassword,
  ...GUEST_ONLY_PATHS,
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/auth/");
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  target.search = "";
  return NextResponse.redirect(target);
}

/** Refreshes the auth cookies and applies optimistic redirects for guests and members. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  if (!isSupabaseConfigured()) {
    return isPublicPath(pathname) ? NextResponse.next() : redirectTo(request, ROUTES.login);
  }

  let response = NextResponse.next({ request });
  const { projectUrl, publishableKey } = getSupabaseEnv();
  const supabase = createServerClient(projectUrl, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: CookieToSet[]) => {
        cookiesToSet.forEach((cookie) => request.cookies.set(cookie.name, cookie.value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach((cookie) =>
          response.cookies.set(cookie.name, cookie.value, cookie.options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  if (!isSignedIn && !isPublicPath(pathname)) return redirectTo(request, ROUTES.login);
  if (isSignedIn && GUEST_ONLY_PATHS.includes(pathname)) return redirectTo(request, ROUTES.learn);
  return response;
}
