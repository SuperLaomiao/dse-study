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

  it("reports an unsupported datasource url before trying Prisma", async () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://user:pass@localhost:5432/legacy_db"
    );

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.mode).toBe("demo");
    expect(status.summary).toContain("unsupported");
    expect(status.nextStep).toContain("mysql://");
    expect(status.issueCode).toBe("unsupported");
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
    expect(status.issueCode).toBe("none");
  });

  it("classifies unreachable mysql errors as a network issue", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $queryRawUnsafe: vi.fn(async () => {
          throw new Error("Can't reach database server at `172.17.0.5:3306`");
        })
      }
    }));

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.connectivity).toBe("unreachable");
    expect(status.issueCode).toBe("network");
    expect(status.summary).toContain("network path");
    expect(status.nextStep).toContain("network");
  });

  it("classifies mysql access denied errors as credentials issues", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $queryRawUnsafe: vi.fn(async () => {
          throw new Error("Access denied for user 'dse_app'@'%' to database 'testing'");
        })
      }
    }));

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.connectivity).toBe("unreachable");
    expect(status.issueCode).toBe("auth");
    expect(status.summary).toContain("credentials");
    expect(status.nextStep).toContain("username");
  });

  it("classifies missing mysql database errors separately", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $queryRawUnsafe: vi.fn(async () => {
          throw new Error("Unknown database 'testing-0gl3765x0fdfd178'");
        })
      }
    }));

    const { getDatabaseAdminStatus } = await import("@/lib/database-admin");
    const status = await getDatabaseAdminStatus();

    expect(status.connectivity).toBe("unreachable");
    expect(status.issueCode).toBe("database_missing");
    expect(status.summary).toContain("database name");
    expect(status.nextStep).toContain("database exists");
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
