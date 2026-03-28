import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("database admin helpers", () => {
  it("reports demo mode when DATABASE_URL is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.mode).toBe("demo");
    expect(status.summary).toContain("demo");
  });

  it("reports connected seeded mysql state when schema exists", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $queryRawUnsafe: vi
          .fn()
          .mockResolvedValueOnce([{ ok: 1 }])
          .mockResolvedValueOnce([{ Tables_in_testing: "Family" }]),
        user: {
          count: vi.fn(async () => 3)
        }
      }
    }));

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.mode).toBe("database");
    expect(status.connectivity).toBe("connected");
    expect(status.schemaReady).toBe(true);
    expect(status.seeded).toBe(true);
  });

  it("runs prisma db push through the bundled cli", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    const runPrismaDbPush = vi.fn(async () => ({ stdout: "", stderr: "" }));

    vi.doMock("@/lib/prisma-cli", () => {
      return {
        runPrismaDbPush
      };
    });

    const { runDatabaseBootstrap } = await import("@/lib/database-admin");
    const result = await runDatabaseBootstrap();

    expect(runPrismaDbPush).toHaveBeenCalled();
    expect(result.status).toBe("success");
  });
});
