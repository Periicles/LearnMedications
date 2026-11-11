import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSession } from "./proxy-session";

const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), getClaims: vi.fn() }));

vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));

function requestFor(path: string) {
  return new NextRequest(`http://localhost:3000${path}`);
}

function signIn(isSignedIn: boolean) {
  mocks.getClaims.mockResolvedValue({ data: isSignedIn ? { claims: { sub: "u1" } } : null });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  mocks.createServerClient.mockReturnValue({ auth: { getClaims: mocks.getClaims } });
});

describe("without Supabase configured", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  });

  it("lets public paths through and sends the rest to the login", async () => {
    const open = await updateSession(requestFor("/demo"));
    expect(open.headers.get("location")).toBeNull();
    const closed = await updateSession(requestFor("/learn?x=1"));
    expect(closed.headers.get("location")).toBe("http://localhost:3000/login");
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });
});

describe("guests", () => {
  beforeEach(() => signIn(false));

  it("are redirected from protected paths without their query string", async () => {
    const response = await updateSession(requestFor("/library?q=a"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("can open public paths", async () => {
    for (const path of ["/", "/login", "/reset-password", "/auth/callback"]) {
      expect((await updateSession(requestFor(path))).headers.get("location")).toBeNull();
    }
  });
});

describe("signed-in users", () => {
  beforeEach(() => signIn(true));

  it("are moved away from guest-only paths", async () => {
    const response = await updateSession(requestFor("/signup"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/learn");
  });

  it("can open protected paths", async () => {
    const response = await updateSession(requestFor("/learn"));
    expect(response.headers.get("location")).toBeNull();
  });
});

describe("cookie refresh", () => {
  it("mirrors refreshed cookies on the request and the response", async () => {
    signIn(true);
    const request = requestFor("/learn");
    request.cookies.set("sb-token", "old");
    mocks.createServerClient.mockImplementation((_url, _key, options) => {
      expect(options.cookies.getAll()).toEqual([{ name: "sb-token", value: "old" }]);
      options.cookies.setAll([{ name: "sb-token", value: "new", options: { path: "/" } }]);
      return { auth: { getClaims: mocks.getClaims } };
    });
    const response = await updateSession(request);
    expect(request.cookies.get("sb-token")?.value).toBe("new");
    expect(response.cookies.get("sb-token")?.value).toBe("new");
  });
});
