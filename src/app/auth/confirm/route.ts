import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import { createServerSupabase } from "@/lib/supabase/server";

function safeNextPath(candidate: string | null): string {
  return candidate && candidate.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : ROUTES.learn;
}

/** Handles e-mail links: PKCE `code` links and `token_hash` links are both supported. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;
  const nextPath = safeNextPath(searchParams.get("next"));
  const supabase = await createServerSupabase();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${nextPath}`);
  }
  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
    if (!error) return NextResponse.redirect(`${origin}${nextPath}`);
  }
  return NextResponse.redirect(`${origin}${ROUTES.login}?error=link`);
}
