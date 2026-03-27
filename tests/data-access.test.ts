import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("data access mode", () => {
  it("uses demo mode when DATABASE_URL is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const { getDataAccessMode } = await import("@/lib/db");

    expect(getDataAccessMode()).toBe("demo");
  });

  it("uses database mode when DATABASE_URL is present", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse");

    const { getDataAccessMode } = await import("@/lib/db");

    expect(getDataAccessMode()).toBe("database");
  });
});
