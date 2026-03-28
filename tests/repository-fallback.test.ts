import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("repository fallback", () => {
  it("falls back to demo family data when Prisma cannot connect", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        family: {
          findFirst: vi.fn(async () => {
            throw new Error("connect ECONNREFUSED");
          })
        }
      }
    }));

    const { getFamilyDashboardData } = await import("@/lib/repositories/family-repository");
    const result = await getFamilyDashboardData();

    expect(result.family.familyName).toBe("Chan Family");
    expect(result.learners.length).toBeGreaterThan(0);
  });

  it("falls back to demo profile data when Prisma profile lookup fails", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://user:pass@localhost:3306/dse_study");

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        learnerProfile: {
          findUnique: vi.fn(async () => {
            throw new Error("connect ECONNREFUSED");
          }),
          findMany: vi.fn(async () => {
            throw new Error("connect ECONNREFUSED");
          })
        }
      }
    }));

    const { getLearnerProfileByUserId } = await import("@/lib/repositories/profile-repository");
    const profile = await getLearnerProfileByUserId("older-brother");

    expect(profile?.profileName).toBe("Older Brother");
  });
});
