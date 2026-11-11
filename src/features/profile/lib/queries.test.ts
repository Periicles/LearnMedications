import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "@/testing/fake-supabase";
import type { FakeSupabase } from "@/types/testing";
import { getDailyXp } from "./queries";

const mocks = vi.hoisted(() => ({ createServerSupabase: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: mocks.createServerSupabase }));

let fake: FakeSupabase;

beforeEach(() => {
  fake = createFakeSupabase();
  mocks.createServerSupabase.mockResolvedValue(fake.client);
});

describe("getDailyXp", () => {
  it("returns the rpc rows for the requested window", async () => {
    fake.respond("get_daily_xp", { data: [{ day: "2026-11-10", xp: 40 }] });
    await expect(getDailyXp(14)).resolves.toEqual([{ day: "2026-11-10", xp: 40 }]);
    expect(fake.calls[0].args[0]).toMatchObject({ p_days: 14 });
  });

  it("returns an empty list when there is no data", async () => {
    await expect(getDailyXp(7)).resolves.toEqual([]);
  });
});
