import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServerSupabase } from "./server";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  cookies: vi.fn(),
  cookieStore: { getAll: vi.fn(), set: vi.fn() },
}));

vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));

async function getCookieAdapter() {
  await createServerSupabase();
  return mocks.createServerClient.mock.calls[0][2].cookies;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  mocks.cookies.mockResolvedValue(mocks.cookieStore);
  mocks.createServerClient.mockReturnValue({ marker: "client" });
});

describe("createServerSupabase", () => {
  it("creates a client bound to the project settings", async () => {
    await expect(createServerSupabase()).resolves.toEqual({ marker: "client" });
    expect(mocks.createServerClient).toHaveBeenCalledWith(
      "https://x.supabase.co",
      "publishable",
      expect.any(Object),
    );
  });

  it("reads and writes the request cookies", async () => {
    const adapter = await getCookieAdapter();
    mocks.cookieStore.getAll.mockReturnValue([{ name: "sb", value: "1" }]);
    expect(adapter.getAll()).toEqual([{ name: "sb", value: "1" }]);
    adapter.setAll([{ name: "sb", value: "2", options: { path: "/" } }]);
    expect(mocks.cookieStore.set).toHaveBeenCalledWith("sb", "2", { path: "/" });
  });

  it("ignores cookie writes refused in Server Components", async () => {
    const adapter = await getCookieAdapter();
    mocks.cookieStore.set.mockImplementation(() => {
      throw new Error("read-only");
    });
    expect(() => adapter.setAll([{ name: "sb", value: "2" }])).not.toThrow();
  });
});
