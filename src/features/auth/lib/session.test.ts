import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { getSessionUser, requireUser } from "./session";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn(), isConfigured: vi.fn() }));

vi.mock("react", () => ({ cache: <Wrapped>(wrapped: Wrapped) => wrapped }));
vi.mock("next/server", () => ({ connection: vi.fn(async () => undefined) }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((target: string) => {
    throw new Error(`NEXT_REDIRECT:${target}`);
  }),
}));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));
vi.mock("@/lib/env", () => ({ isSupabaseConfigured: mocks.isConfigured }));

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
  mocks.isConfigured.mockReturnValue(true);
});

describe("getSessionUser", () => {
  it("is empty when Supabase is not configured", async () => {
    mocks.isConfigured.mockReturnValue(false);
    await expect(getSessionUser()).resolves.toBeNull();
    expect(fake.calls).toEqual([]);
  });

  it("is empty without verified claims", async () => {
    fake.respond("auth.getClaims", { data: null });
    await expect(getSessionUser()).resolves.toBeNull();
    fake.respond("auth.getClaims", { data: { claims: {} } });
    await expect(getSessionUser()).resolves.toBeNull();
  });

  it("returns the id and e-mail from the claims", async () => {
    fake.respond("auth.getClaims", { data: { claims: { sub: "u1", email: "a@b.fr" } } });
    await expect(getSessionUser()).resolves.toEqual({ id: "u1", email: "a@b.fr" });
  });

  it("uses an empty e-mail when the claim is not a string", async () => {
    fake.respond("auth.getClaims", { data: { claims: { sub: "u1", email: 3 } } });
    await expect(getSessionUser()).resolves.toEqual({ id: "u1", email: "" });
  });
});

describe("requireUser", () => {
  it("redirects guests to the login", async () => {
    fake.respond("auth.getClaims", { data: null });
    await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT:/login");
  });

  it("returns the signed-in user", async () => {
    fake.respond("auth.getClaims", { data: { claims: { sub: "u2" } } });
    await expect(requireUser()).resolves.toEqual({ id: "u2", email: "" });
  });
});
