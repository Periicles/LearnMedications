import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { deleteAccount, updateProfile } from "./actions";

const mocks = vi.hoisted(() => ({
  createServerSupabase: vi.fn(),
  createAdminSupabase: vi.fn(),
  requireUser: vi.fn(),
  getProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminSupabase: mocks.createAdminSupabase }));
vi.mock("@/features/auth/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/features/progress/lib/queries", () => ({ getProfile: mocks.getProfile }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
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
let fake: FakeSupabase;
let admin: FakeSupabase;

beforeEach(() => {
  vi.clearAllMocks();
  fake = createFakeSupabase();
  admin = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
  mocks.createAdminSupabase.mockReturnValue(admin.client);
  mocks.requireUser.mockResolvedValue({ id: "u1", email: "a@b.fr" });
});

describe("updateProfile", () => {
  const form = { username: "Lea_91", avatar: "🩺" };

  it("rejects invalid input and echoes the values", async () => {
    const state = await updateProfile(idle, makeForm({ username: "x", avatar: "?" }));
    expect(state.fieldErrors).toHaveProperty("username");
    expect(state.fieldErrors).toHaveProperty("avatar");
    expect(state.values).toEqual({ username: "x", avatar: "?" });
    expect(fake.calls).toEqual([]);
  });

  it("explains a taken username", async () => {
    fake.respond("profiles", { error: { code: "23505" } });
    const state = await updateProfile(idle, makeForm(form));
    expect(state.fieldErrors).toEqual({ username: "Ce pseudo est déjà pris." });
    expect(state.values).toEqual(form);
  });

  it("reports other database errors", async () => {
    fake.respond("profiles", { error: { code: "XX000" } });
    const state = await updateProfile(idle, makeForm(form));
    expect(state).toMatchObject({
      status: "error",
      message: "Le profil n'a pas pu être enregistré.",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("saves the normalised profile for the current user", async () => {
    const state = await updateProfile(idle, makeForm(form));
    expect(state).toEqual({ status: "success", message: "Profil mis à jour." });
    expect(fake.calls[0]).toMatchObject({
      method: "update",
      args: [{ username: "lea_91", avatar: "🩺" }],
    });
    expect(fake.calls[1]).toMatchObject({ method: "eq", args: ["id", "u1"] });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});

describe("deleteAccount", () => {
  it("asks for the exact username when there is no profile or no confirmation", async () => {
    mocks.getProfile.mockResolvedValue(null);
    const missing = await deleteAccount(idle, makeForm({ confirmation: "lea" }));
    expect(missing.fieldErrors).toEqual({ confirmation: "Saisissez votre pseudo exact." });
    mocks.getProfile.mockResolvedValue({ username: "lea" });
    const wrong = await deleteAccount(idle, makeForm({ confirmation: "bob" }));
    expect(wrong.status).toBe("error");
    expect(admin.calls).toEqual([]);
  });

  it("reports a failed deletion without signing out", async () => {
    mocks.getProfile.mockResolvedValue({ username: "lea" });
    admin.respond("auth.admin.deleteUser", { error: { message: "boom" } });
    const state = await deleteAccount(idle, makeForm({ confirmation: "lea" }));
    expect(state).toMatchObject({ message: "Le compte n'a pas pu être supprimé." });
    expect(fake.calls).toEqual([]);
  });

  it("deletes the user, signs out and goes home (case-insensitive confirmation)", async () => {
    mocks.getProfile.mockResolvedValue({ username: "lea" });
    await expect(deleteAccount(idle, makeForm({ confirmation: " LEA " }))).rejects.toThrow(
      "NEXT_REDIRECT:/",
    );
    expect(admin.calls[0]).toMatchObject({ method: "admin.deleteUser", args: ["u1"] });
    expect(fake.calls[0].method).toBe("signOut");
  });
});
