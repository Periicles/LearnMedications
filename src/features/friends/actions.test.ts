import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { acceptFriendRequest, removeFriendship, sendFriendRequest } from "./actions";

const mocks = vi.hoisted(() => ({
  createServerSupabase: vi.fn(),
  requireUser: vi.fn(),
  revalidatePath: vi.fn(),
  grantFriendBadges: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));
vi.mock("@/features/auth/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("./lib/friend-badges", () => ({ grantFriendBadges: mocks.grantFriendBadges }));

function makeForm(entries: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(entries).forEach(([field, value]) => formData.set(field, value));
  return formData;
}

const idle = { status: "idle" as const };
const friendId = "123e4567-e89b-42d3-a456-426614174000";
let fake: FakeSupabase;

beforeEach(() => {
  vi.clearAllMocks();
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
  mocks.requireUser.mockResolvedValue({ id: "u1", email: "a@b.fr" });
});

describe("sendFriendRequest", () => {
  const form = makeForm({ username: "Bob" });

  it("rejects an invalid username and echoes it", async () => {
    const state = await sendFriendRequest(idle, makeForm({ username: "!" }));
    expect(state.fieldErrors).toHaveProperty("username");
    expect(state.values).toEqual({ username: "!" });
    expect(fake.calls).toEqual([]);
  });

  it("reports an unknown username", async () => {
    const state = await sendFriendRequest(idle, form);
    expect(state).toMatchObject({
      message: "Aucun utilisateur ne porte ce pseudo.",
      values: { username: "Bob" },
    });
  });

  it("refuses to add oneself", async () => {
    fake.respond("profiles", { data: { id: "u1" } });
    const state = await sendFriendRequest(idle, form);
    expect(state.message).toBe("Vous ne pouvez pas vous ajouter vous-même.");
  });

  it("explains an existing friendship or pending request", async () => {
    fake.respond("profiles", { data: { id: "u2" } });
    fake.respond("friendships", { data: { status: "accepted" } });
    expect((await sendFriendRequest(idle, form)).message).toBe("Vous êtes déjà amis.");
    fake.respond("profiles", { data: { id: "u2" } });
    fake.respond("friendships", { data: { status: "pending" } });
    expect((await sendFriendRequest(idle, form)).message).toBe(
      "Une demande est déjà en attente avec cette personne.",
    );
  });

  it("reports an insert failure", async () => {
    fake.respond("profiles", { data: { id: "u2" } });
    fake.respond("friendships", { data: null });
    fake.respond("friendships", { error: { code: "XX000" } });
    const state = await sendFriendRequest(idle, form);
    expect(state.message).toBe("La demande n'a pas pu être envoyée.");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("sends the request with the normalised username", async () => {
    fake.respond("profiles", { data: { id: "u2" } });
    const state = await sendFriendRequest(idle, form);
    expect(state).toEqual({ status: "success", message: "Demande envoyée à bob." });
    expect(fake.calls.find((call) => call.method === "insert")?.args[0]).toEqual({
      requester_id: "u1",
      addressee_id: "u2",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/friends");
  });
});

describe("acceptFriendRequest", () => {
  it("ignores an invalid friend id", async () => {
    await acceptFriendRequest(makeForm({ friendId: "nope" }));
    expect(fake.calls).toEqual([]);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("grants badges to both users when a request was accepted", async () => {
    fake.respond("friendships", { data: [{ requester_id: friendId }] });
    await acceptFriendRequest(makeForm({ friendId }));
    expect(mocks.grantFriendBadges).toHaveBeenCalledWith(["u1", friendId]);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("grants nothing when no pending request matched", async () => {
    fake.respond("friendships", { data: [] });
    await acceptFriendRequest(makeForm({ friendId }));
    fake.respond("friendships", { data: null });
    await acceptFriendRequest(makeForm({ friendId }));
    expect(mocks.grantFriendBadges).not.toHaveBeenCalled();
  });
});

describe("removeFriendship", () => {
  it("ignores an invalid friend id", async () => {
    await removeFriendship(makeForm({}));
    expect(fake.calls).toEqual([]);
  });

  it("deletes the relation in both directions", async () => {
    await removeFriendship(makeForm({ friendId }));
    expect(fake.calls[0].method).toBe("delete");
    expect(String(fake.calls[1].args[0])).toContain(
      `requester_id.eq.${friendId},addressee_id.eq.u1`,
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/friends");
  });
});
