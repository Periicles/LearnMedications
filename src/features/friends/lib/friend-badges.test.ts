import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { grantFriendBadges } from "./friend-badges";

const mocks = vi.hoisted(() => ({ createAdminSupabase: vi.fn() }));

vi.mock("@/lib/supabase/admin", () => ({ createAdminSupabase: mocks.createAdminSupabase }));

let admin: FakeSupabase;

beforeEach(() => {
  vi.restoreAllMocks();
  admin = createFakeSupabase();
  mocks.createAdminSupabase.mockReturnValue(admin.client);
});

function upserts() {
  return admin.calls.filter((call) => call.method === "upsert");
}

describe("grantFriendBadges", () => {
  it("grants the thresholds reached by each user", async () => {
    admin.respond("friendships", { count: 1 });
    admin.respond("friendships", { count: 5 });
    await grantFriendBadges(["u1", "u2"]);
    const [first, second] = upserts().map((call) => call.args[0]);
    expect(first).toEqual([{ user_id: "u1", achievement_key: "friend-1" }]);
    expect(second).toEqual([
      { user_id: "u2", achievement_key: "friend-1" },
      { user_id: "u2", achievement_key: "friend-5" },
    ]);
    expect(upserts()[0].args[1]).toEqual({ ignoreDuplicates: true });
  });

  it("grants nothing without accepted friends", async () => {
    admin.respond("friendships", { count: null });
    await grantFriendBadges(["u1"]);
    expect(upserts()).toEqual([]);
  });

  it("only logs a failure so the friendship is not hidden", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.createAdminSupabase.mockImplementation(() => {
      throw new Error("no key");
    });
    await expect(grantFriendBadges(["u1"])).resolves.toBeUndefined();
    expect(logged).toHaveBeenCalledWith(
      "Could not grant friendship achievements",
      expect.any(Error),
    );
  });
});
