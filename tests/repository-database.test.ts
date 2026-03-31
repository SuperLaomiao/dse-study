import { afterEach, describe, expect, it, vi } from "vitest";

// Mock getCurrentSession to avoid cookies() outside request scope error
vi.mock('@/lib/auth/server', () => ({
  getCurrentSession: () => ({
    userId: 'demo-admin',
    role: 'admin',
    email: 'mom@example.com',
    name: 'Mom Admin'
  })
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("database-backed repositories", () => {
  it("verifies credentials against the stored password hash in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

    const findUnique = vi.fn(async () => ({
      id: "mom-admin",
      email: "mom@example.com",
      displayName: "Mom Admin",
      passwordHash: "stored-hash",
      memberships: [
        {
          role: "mom_admin",
          status: "active",
          joinedAt: new Date("2026-03-30T00:00:00.000Z")
        }
      ]
    }));
    const comparePassword = vi.fn(async () => true);

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique
        }
      }
    }));

    vi.doMock("@/lib/auth/password", async () => {
      const actual = await vi.importActual<typeof import("@/lib/auth/password")>("@/lib/auth/password");
      return {
        ...actual,
        comparePassword
      };
    });

    const { verifyUserCredentials } = await import("@/lib/repositories/account-repository");
    const user = await verifyUserCredentials({
      email: "mom@example.com",
      password: "ParentPass123"
    });

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        email: "mom@example.com"
      },
      include: {
        memberships: {
          where: {
            status: "active"
          },
          orderBy: {
            joinedAt: "asc"
          }
        }
      }
    });
    expect(comparePassword).toHaveBeenCalledWith("ParentPass123", "stored-hash");
    expect(user).toEqual({
      userId: "mom-admin",
      role: "admin",
      email: "mom@example.com",
      name: "Mom Admin"
    });
  });

  it("loads a learner profile through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

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
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

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

  it("localizes database-backed family dashboard labels for chinese locale", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

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
              track: "foundation_to_dse",
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
    const data = await getFamilyDashboardData("zh");

     expect(data.snapshot.familyLabel).toBe("家庭总览");
     expect(data.learners[0]?.stage).toBe("中三");
     expect(data.learners[0]?.track).toBe("基础衔接 DSE");
  });

  it("localizes database-backed admin learner detail labels for chinese locale", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

    const findUnique = vi.fn(async () => ({
      userId: "older-brother",
      studyMinutesPerDay: 50,
      studyDaysPerWeek: 6,
      targetReferenceLevel: "B2",
      targetInternalBand: "Band 5*",
      schoolStage: "f3",
      track: "companion",
      user: {
        displayName: "Older Brother"
      }
    }));

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        learnerProfile: {
          findUnique
        }
      }
    }));

    const { getAdminLearnerDetailById } = await import("@/lib/repositories/profile-repository");
    const detail = await getAdminLearnerDetailById("older-brother", "zh");

    expect(detail?.stage).toBe("中三");
    expect(detail?.track).toBe("陪伴模式");
  });
});
