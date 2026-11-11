import { afterEach, describe, expect, it, vi } from "vitest";
import { getSecretKey, getSiteUrl, getSupabaseEnv, isSupabaseConfigured } from "./env";

function stubSupabase(projectUrl: string, publishableKey: string) {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", projectUrl);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishableKey);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isSupabaseConfigured", () => {
  it("needs both the url and the publishable key", () => {
    stubSupabase("", "");
    expect(isSupabaseConfigured()).toBe(false);
    stubSupabase("https://x.supabase.co", "");
    expect(isSupabaseConfigured()).toBe(false);
    stubSupabase("https://x.supabase.co", "key");
    expect(isSupabaseConfigured()).toBe(true);
  });
});

describe("getSupabaseEnv", () => {
  it("returns the project settings", () => {
    stubSupabase("https://x.supabase.co", "key");
    expect(getSupabaseEnv()).toEqual({
      projectUrl: "https://x.supabase.co",
      publishableKey: "key",
    });
  });

  it("throws when a setting is missing", () => {
    stubSupabase("", "");
    expect(() => getSupabaseEnv()).toThrow("Supabase is not configured");
  });
});

describe("getSecretKey", () => {
  it("returns the secret key or throws", () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "secret");
    expect(getSecretKey()).toBe("secret");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    expect(() => getSecretKey()).toThrow("SUPABASE_SECRET_KEY is missing.");
  });
});

describe("getSiteUrl", () => {
  it("prefers the public site url and strips the trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://app.test/");
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    expect(getSiteUrl()).toBe("https://app.test");
  });

  it("falls back to the Vercel url, then to localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    expect(getSiteUrl()).toBe("https://preview.vercel.app");
    vi.stubEnv("VERCEL_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
