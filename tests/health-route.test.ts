import { vi } from "vitest";

vi.mock("@/lib/database-admin", () => ({
  getDatabaseAdminStatus: vi.fn(async () => ({
    mode: "database",
    connectivity: "connected",
    schemaReady: true,
    seeded: true,
    summary: "Neon Postgres is reachable and seeded.",
    nextStep: "Database is ready for the learner and admin flows.",
    issueCode: "none",
    detail: "The runtime can query the shared Neon Postgres instance."
  }))
}));

import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("returns app and database readiness information", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.app).toBe("dse-study");
    expect(payload.database.connectivity).toBe("connected");
    expect(payload.database.schemaReady).toBe(true);
    expect(payload.database.issueCode).toBe("none");
  });
});
