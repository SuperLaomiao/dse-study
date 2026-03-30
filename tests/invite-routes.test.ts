import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("invite routes", () => {
  it("returns chinese invalid-token feedback by default on invite lookup", async () => {
    const { GET } = await import("@/app/api/invites/[token]/route");

    const response = await GET(new Request("http://localhost:3000/api/invites/bad"), {
      params: Promise.resolve({ token: "bad" })
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("邀请链接无效。");
  });

  it("returns chinese unauthorized feedback by default on invite accept", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null)
    }));

    const { POST } = await import("@/app/api/invites/[token]/accept/route");

    const response = await POST(new Request("http://localhost:3000/api/invites/demo-token/accept", {
      method: "POST"
    }), {
      params: Promise.resolve({ token: "demo-invite-token" })
    });
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("请先登录，再接受邀请。");
  });

  it("returns the learner redirect after a successful invite accept", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => ({ userId: "learner-1", role: "learner" }))
    }));

    vi.doMock("@/lib/repositories/invite-repository", () => ({
      getInviteByToken: vi.fn(async () => ({
        id: "invite-1",
        familyId: "family-1",
        email: "learner@example.com",
        role: "learner",
        expiresAt: new Date("2026-04-05T00:00:00.000Z"),
        isValid: true,
        isExpired: false,
        isAccepted: false
      })),
      acceptInvite: vi.fn(async () => true)
    }));

    const { POST } = await import("@/app/api/invites/[token]/accept/route");

    const response = await POST(new Request("http://localhost:3000/api/invites/demo-token/accept", {
      method: "POST"
    }), {
      params: Promise.resolve({ token: "demo-invite-token" })
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.redirectTo).toBe("/home");
  });

  it("returns english unauthorized feedback on invite accept when locale cookie is english", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null)
    }));

    const { POST } = await import("@/app/api/invites/[token]/accept/route");

    const response = await POST(new Request("http://localhost:3000/api/invites/demo-token/accept", {
      method: "POST",
      headers: {
        cookie: "dse-study-locale=en"
      }
    }), {
      params: Promise.resolve({ token: "demo-invite-token" })
    });
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Unauthorized - please sign in first");
  });

  it("returns chinese unauthorized feedback by default on invite create", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null)
    }));

    const { POST } = await import("@/app/api/invites/create/route");

    const response = await POST(new Request("http://localhost:3000/api/invites/create", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ email: "new@example.com" })
    }));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("未授权，请先登录。");
  });
});
