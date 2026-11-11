import { existsSync } from "node:fs";

/** Loads `.env.local` for local runs; CI provides the variables directly. */
export function loadTestEnv(): void {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
}

export function hasBackend(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.SUPABASE_SECRET_KEY,
  );
}

export const E2E_PORT = 3100;
/** Set E2E_BASE_URL to test a deployed site instead of a local production build. */
export const REMOTE_URL = process.env.E2E_BASE_URL?.replace(/\/$/, "");
export const BASE_URL = REMOTE_URL ?? `http://localhost:${E2E_PORT}`;
export const USERS_FILE = "e2e/.auth/users.json";
export const TEST_PASSWORD = "E2e-password-2026";

export function storageFile(projectName: string): string {
  return `e2e/.auth/${projectName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
}
