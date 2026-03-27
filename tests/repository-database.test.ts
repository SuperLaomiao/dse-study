import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("database-backed repositories", () => {
  it("loads a learner profile through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse");

    const findUnique = vi.fn(async () => ({
      id: "profile-older-brother",
      userId: "older-brother",
      familyId: "chan-family",
      profileName: "Older Brother",
      track: "dse",
      schoolStage: "f3",
      studyMinutesPerDay: 50,
      studyDaysPerWeek: 6,
      targetReferenceLevel: "B2",
      targetInternalBand: "Band 5*"
    }));

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        learnerProfile: {
          findUnique
        }
      }
    }));

    const { getLearnerProfileByUserId } = await import("@/lib/repositories/profile-repository");
    const profile = await getLearnerProfileByUserId("older-brother");

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        userId: "older-brother"
      }
    });
    expect(profile?.profileName).toBe("Older Brother");
  });

  it("loads family dashboard data through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse");

    const findFirst = vi.fn(async () => ({
      name: "Chan Family",
      createdByUser: {
        displayName: "Mom Admin"
      },
      memberships: [
        {
          role: "learner",
          user: {
            id: "older-brother",
            displayName: "Older Brother",
            learnerProfile: {
              schoolStage: "f3",
              track: "dse",
              targetReferenceLevel: "B2",
              targetInternalBand: "Band 5*"
            }
          }
        }
      ]
    }));

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        family: {
          findFirst
        }
      }
    }));

    const { getFamilyDashboardData } = await import("@/lib/repositories/family-repository");
    const data = await getFamilyDashboardData();

    expect(findFirst).toHaveBeenCalled();
    expect(data.family.familyName).toBe("Chan Family");
    expect(data.learners[0]?.name).toBe("Older Brother");
  });
});
