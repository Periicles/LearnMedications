import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { login, logout, requestPasswordReset, signup, updatePassword } from "./actions";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((target: string) => {
    throw new Error(`NEXT_REDIRECT:${target}`);
  }),
}));

function makeForm(entries: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(entries).forEach(([field, value]) => formData.set(field, value));
  return formData;
}

const idle = { status: "idle" as const };
const credentials = { email: "Lea@Example.com", password: "Test-password-2026" };
let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
});

describe("login", () => {
  it("rejects invalid input and keeps the e-mail", async () => {
    const state = await login(idle, makeForm({ email: "nope", password: "" }));
    expect(state.fieldErrors).toHaveProperty("email");
    expect(state.values).toEqual({ email: "nope" });
    expect(fake.calls).toEqual([]);
  });

  it("explains wrong credentials", async () => {
    fake.respond("auth.signInWithPassword", { error: { code: "invalid_credentials" } });
    const state = await login(idle, makeForm(credentials));
    expect(state).toMatchObject({ status: "error", message: "E-mail ou mot de passe incorrect." });
  });

  it("redirects to the learning home on success", async () => {
    await expect(login(idle, makeForm(credentials))).rejects.toThrow("NEXT_REDIRECT:/learn");
    expect(fake.calls[0].args[0]).toMatchObject({ email: "lea@example.com" });
  });
});

describe("signup", () => {
  const form = { ...credentials, username: "Lea_91" };

  it("refuses a taken username before creating the account", async () => {
    fake.respond("is_username_available", { data: false });
    const state = await signup(idle, makeForm(form));
    expect(state.fieldErrors).toEqual({ username: "Ce pseudo est déjà pris." });
    expect(fake.calls.some((call) => call.method === "signUp")).toBe(false);
  });

  it("asks to confirm the e-mail when no session is returned", async () => {
    fake.respond("is_username_available", { data: true });
    fake.respond("auth.signUp", { data: { session: null } });
    const state = await signup(idle, makeForm(form));
    expect(state.status).toBe("success");
    const signUpCall = fake.calls.find((call) => call.method === "signUp");
    expect(signUpCall?.args[0]).toMatchObject({ options: { data: { username: "lea_91" } } });
  });

  it("redirects when the session starts immediately and reports provider errors", async () => {
    fake.respond("auth.signUp", { data: { session: { access_token: "token" } } });
    await expect(signup(idle, makeForm(form))).rejects.toThrow("NEXT_REDIRECT:/learn");
    fake.respond("auth.signUp", { data: {}, error: { code: "user_already_exists" } });
    const state = await signup(idle, makeForm(form));
    expect(state.message).toBe("Un compte existe déjà avec cette adresse e-mail.");
    expect((await signup(idle, makeForm({ username: "x" }))).status).toBe("error");
  });
});

describe("password flows", () => {
  it("sends a reset link and validates the address", async () => {
    expect((await requestPasswordReset(idle, makeForm({ email: "bad" }))).status).toBe("error");
    const state = await requestPasswordReset(idle, makeForm({ email: credentials.email }));
    expect(state.status).toBe("success");
    fake.respond("auth.resetPasswordForEmail", { error: { code: "over_email_send_rate_limit" } });
    const limited = await requestPasswordReset(idle, makeForm({ email: credentials.email }));
    expect(limited.message).toContain("Trop d'e-mails");
  });

  it("updates the password when both entries match", async () => {
    const mismatch = makeForm({ password: "Test-password-2026", confirmation: "other" });
    expect((await updatePassword(idle, mismatch)).fieldErrors).toHaveProperty("confirmation");
    const matching = makeForm({
      password: "Test-password-2026",
      confirmation: "Test-password-2026",
    });
    await expect(updatePassword(idle, matching)).rejects.toThrow("NEXT_REDIRECT:/learn");
    fake.respond("auth.updateUser", { error: { code: "same_password" } });
    expect((await updatePassword(idle, matching)).status).toBe("error");
  });
});

describe("logout", () => {
  it("signs out and returns to the landing page", async () => {
    await expect(logout()).rejects.toThrow("NEXT_REDIRECT:/");
    expect(fake.calls.at(-1)?.method).toBe("signOut");
  });
});
