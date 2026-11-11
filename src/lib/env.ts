import type { SupabaseEnv } from "@/types/auth";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabaseEnv(): SupabaseEnv {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!projectUrl || !publishableKey) {
    throw new Error("Supabase is not configured. Copy .env.example to .env.local and fill it in.");
  }
  return { projectUrl, publishableKey };
}

export function getSecretKey(): string {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is missing.");
  return secretKey;
}

export function getSiteUrl(): string {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return (process.env.NEXT_PUBLIC_SITE_URL ?? vercelUrl ?? DEFAULT_SITE_URL).replace(/\/$/, "");
}
