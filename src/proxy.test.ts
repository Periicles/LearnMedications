import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { config, proxy } from "./proxy";

const mocks = vi.hoisted(() => ({ updateSession: vi.fn() }));

vi.mock("@/lib/supabase/proxy-session", () => ({ updateSession: mocks.updateSession }));

describe("proxy", () => {
  it("delegates to the session refresh", async () => {
    const request = new NextRequest("http://localhost:3000/learn");
    const response = new Response("ok");
    mocks.updateSession.mockResolvedValue(response);
    await expect(proxy(request)).resolves.toBe(response);
    expect(mocks.updateSession).toHaveBeenCalledWith(request);
  });

  it("skips static assets in the matcher", () => {
    const pattern = new RegExp(`^${config.matcher[0]}$`);
    expect(pattern.test("/learn")).toBe(true);
    expect(pattern.test("/_next/static/chunk.js")).toBe(false);
    expect(pattern.test("/logo.png")).toBe(false);
    expect(pattern.test("/icons/app.svg")).toBe(false);
  });
});
