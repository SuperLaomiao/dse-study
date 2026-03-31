import { describe, expect, it, vi } from "vitest";

// Must stub env before importing modules that use env validation
vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost/db");
vi.stubEnv("NODE_ENV", "test");

// Now import after stubbing
const { GET } = await import("@/app/api/health/route");

describe("health route", () => {
  it("returns correct status when database is not reachable in test", async () => {
    const response = await GET();
    const payload = await response.json();

    // We stubbed DATABASE_URL but there's no database running on localhost
    expect(response.status).toBe(503);
    expect(payload.status).toBe("degraded");
    expect(payload.app).toBe("dse-study");
    expect(payload.database.configured).toBe(true);
    expect(payload.database.connected).toBe(false);
    expect(payload.database.error).toBeDefined();
  });
});
