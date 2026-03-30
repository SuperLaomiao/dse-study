import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("route auth helper", () => {
  it("allows demo-user in demo mode when there is no session", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/db", () => ({
      getDataAccessMode: vi.fn(() => "demo"),
    }));

    const { resolveRouteUser } = await import("@/lib/api-auth");
    const result = await resolveRouteUser(new Request("http://localhost:3000/api/test"));

    expect(result).toEqual({ userId: "demo-user" });
  });

  it("rejects unauthenticated database-mode requests in chinese by default", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/db", () => ({
      getDataAccessMode: vi.fn(() => "database"),
    }));

    const { resolveRouteUser } = await import("@/lib/api-auth");
    const result = await resolveRouteUser(new Request("http://localhost:3000/api/test"));

    expect("response" in result).toBe(true);
    if ("response" in result) {
      expect(result.response.status).toBe(401);
      expect(await result.response.json()).toEqual({
        error: "请先登录，再继续操作。",
      });
    }
  });

  it("rejects unauthenticated database-mode requests in english when locale cookie is english", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/db", () => ({
      getDataAccessMode: vi.fn(() => "database"),
    }));

    const { resolveRouteUser } = await import("@/lib/api-auth");
    const result = await resolveRouteUser(
      new Request("http://localhost:3000/api/test", {
        headers: {
          cookie: "dse-study-locale=en",
        },
      }),
    );

    expect("response" in result).toBe(true);
    if ("response" in result) {
      expect(result.response.status).toBe(401);
      expect(await result.response.json()).toEqual({
        error: "Please sign in before continuing.",
      });
    }
  });
});
