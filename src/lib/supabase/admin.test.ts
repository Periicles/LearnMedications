import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAdminSupabase } from "./admin";

const mocks = vi.hoisted(() => ({ createClient: vi.fn() }));

vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  vi.stubEnv("SUPABASE_SECRET_KEY", "secret");
});

describe("createAdminSupabase", () => {
  it("uses the secret key without persisting a session", () => {
    mocks.createClient.mockReturnValue({ marker: "admin" });
    expect(createAdminSupabase()).toEqual({ marker: "admin" });
    expect(mocks.createClient).toHaveBeenCalledWith("https://x.supabase.co", "secret", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it("fails when the secret key is missing", () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    expect(() => createAdminSupabase()).toThrow("SUPABASE_SECRET_KEY is missing.");
  });
});
