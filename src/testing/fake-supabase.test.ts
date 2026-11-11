import { describe, expect, it } from "vitest";
import { createFakeSupabase } from "./fake-supabase";

describe("createFakeSupabase", () => {
  it("resolves chained queries with queued results and records calls", async () => {
    const fake = createFakeSupabase();
    fake.respond("profiles", { data: [{ id: "one" }] });
    const builder = fake.client.from("profiles") as Record<string, (...args: unknown[]) => unknown>;
    const result = await (
      builder.select("id") as Record<string, (...args: unknown[]) => unknown>
    ).eq("id", "one");
    expect(result).toMatchObject({ data: [{ id: "one" }], error: null });
    expect(fake.calls.map((call) => call.method)).toEqual(["select", "eq"]);
  });

  it("returns empty results by default and supports rpc and auth", async () => {
    const fake = createFakeSupabase();
    fake.respond("auth.signOut", { error: { code: "boom" } });
    expect(await fake.client.rpc("get_stats")).toMatchObject({ data: null });
    expect(await fake.client.auth.signOut()).toMatchObject({ error: { code: "boom" } });
    expect(await fake.client.auth.admin.deleteUser("id")).toMatchObject({ error: null });
  });
});
