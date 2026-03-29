import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("phase 1 account actions", () => {
  it("persists family creation through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

    const userUpsert = vi.fn(async () => ({
      id: "mom-admin",
      email: "mom@example.com",
      displayName: "Mom Admin"
    }));
    const familyFindFirst = vi.fn(async () => null);
    const familyCreate = vi.fn(async () => ({
      id: "family-1",
      name: "Chan Family",
      createdByUserId: "mom-admin"
    }));
    const familyUpdate = vi.fn();
    const membershipUpsert = vi.fn(async () => ({
      id: "membership-1"
    }));
    const inviteDeleteMany = vi.fn(async () => ({ count: 0 }));
    const inviteCreateMany = vi.fn(async () => ({ count: 2 }));

    const tx = {
      user: { upsert: userUpsert },
      family: { findFirst: familyFindFirst, create: familyCreate, update: familyUpdate },
      familyMembership: { upsert: membershipUpsert },
      familyInvite: { deleteMany: inviteDeleteMany, createMany: inviteCreateMany }
    };

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $transaction: vi.fn(async (callback: (client: typeof tx) => unknown) => callback(tx))
      }
    }));

    vi.doMock("@/lib/auth/server", async () => {
      const actual = await vi.importActual<typeof import("@/lib/auth/server")>("@/lib/auth/server");

      return {
        ...actual,
        getCurrentSession: vi.fn(async () => null)
      };
    });

    const { createFamilyAction } = await import("@/app/actions/account");
    const formData = new FormData();
    formData.set("familyName", "Chan Family");
    formData.set("parentName", "Mom Admin");

    const result = await createFamilyAction(
      { status: "idle", message: "" },
      formData
    );

    expect(userUpsert).toHaveBeenCalled();
    expect(familyFindFirst).toHaveBeenCalledWith({
      where: {
        createdByUserId: "mom-admin"
      }
    });
    expect(familyCreate).toHaveBeenCalledWith({
      data: {
        name: "Chan Family",
        createdByUserId: "mom-admin"
      }
    });
    expect(membershipUpsert).toHaveBeenCalled();
    expect(inviteDeleteMany).toHaveBeenCalledWith({
      where: {
        familyId: "family-1",
        acceptedAt: null
      }
    });
    expect(inviteCreateMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          familyId: "family-1",
          email: "brother@example.com",
          inviteToken: "CHAN-FAMILY-BROTHER"
        }),
        expect.objectContaining({
          familyId: "family-1",
          email: "sister@example.com",
          inviteToken: "CHAN-FAMILY-SISTER"
        })
      ])
    });
    expect(result).toEqual({
      status: "success",
      message: "Chan Family saved. Demo learner invites are ready to join."
    });
  });

  it("persists family join through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

    const inviteFindFirst = vi.fn(async () => ({
      id: "invite-1",
      familyId: "family-1",
      email: "brother@example.com",
      family: {
        id: "family-1",
        name: "Chan Family"
      }
    }));
    const userUpsert = vi.fn(async () => ({
      id: "older-brother",
      email: "brother@example.com",
      displayName: "Older Brother"
    }));
    const membershipUpsert = vi.fn(async () => ({
      id: "membership-2"
    }));
    const inviteUpdate = vi.fn(async () => ({
      id: "invite-1"
    }));

    const tx = {
      familyInvite: { findFirst: inviteFindFirst, update: inviteUpdate },
      user: { upsert: userUpsert },
      familyMembership: { upsert: membershipUpsert }
    };

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $transaction: vi.fn(async (callback: (client: typeof tx) => unknown) => callback(tx))
      }
    }));

    const { joinFamilyAction } = await import("@/app/actions/account");
    const formData = new FormData();
    formData.set("email", "brother@example.com");
    formData.set("inviteCode", "CHAN-FAMILY");

    const result = await joinFamilyAction(
      { status: "idle", message: "" },
      formData
    );

    expect(inviteFindFirst).toHaveBeenCalledWith({
      where: {
        email: "brother@example.com",
        acceptedAt: null,
        expiresAt: {
          gt: expect.any(Date)
        },
        inviteToken: {
          startsWith: "CHAN-FAMILY"
        }
      },
      include: {
        family: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    expect(userUpsert).toHaveBeenCalled();
    expect(membershipUpsert).toHaveBeenCalled();
    expect(inviteUpdate).toHaveBeenCalledWith({
      where: {
        id: "invite-1"
      },
      data: {
        acceptedAt: expect.any(Date)
      }
    });
    expect(result).toEqual({
      status: "success",
      message: "Joined Chan Family. Your learner access is now active."
    });
  });

  it("persists learner profile setup through Prisma in database mode", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/dse_study");

    const membershipFindFirst = vi.fn(async () => ({
      familyId: "family-1"
    }));
    const userUpdate = vi.fn(async () => ({
      id: "older-brother"
    }));
    const profileUpsert = vi.fn(async () => ({
      id: "profile-1",
      profileName: "Older Brother"
    }));

    const tx = {
      familyMembership: { findFirst: membershipFindFirst },
      user: { update: userUpdate },
      learnerProfile: { upsert: profileUpsert }
    };

    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        $transaction: vi.fn(async (callback: (client: typeof tx) => unknown) => callback(tx))
      }
    }));

    vi.doMock("@/lib/auth/server", async () => {
      const actual = await vi.importActual<typeof import("@/lib/auth/server")>("@/lib/auth/server");

      return {
        ...actual,
        getCurrentSession: vi.fn(async () => ({
          userId: "older-brother",
          role: "learner"
        }))
      };
    });

    const { saveLearnerProfileAction } = await import("@/app/actions/profile");
    const formData = new FormData();
    formData.set("profileName", "Older Brother");
    formData.set("track", "dse");
    formData.set("schoolStage", "f3");
    formData.set("studyMinutesPerDay", "50");
    formData.set("studyDaysPerWeek", "6");
    formData.set("targetReferenceLevel", "B2");
    formData.set("targetInternalBand", "Band 5*");

    const result = await saveLearnerProfileAction(
      { status: "idle", message: "" },
      formData
    );

    expect(membershipFindFirst).toHaveBeenCalledWith({
      where: {
        userId: "older-brother",
        role: "learner",
        status: "active"
      },
      orderBy: {
        joinedAt: "desc"
      }
    });
    expect(userUpdate).toHaveBeenCalledWith({
      where: {
        id: "older-brother"
      },
      data: {
        displayName: "Older Brother"
      }
    });
    expect(profileUpsert).toHaveBeenCalledWith({
      where: {
        userId: "older-brother"
      },
      update: {
        familyId: "family-1",
        profileName: "Older Brother",
        track: "dse",
        schoolStage: "f3",
        studyMinutesPerDay: 50,
        studyDaysPerWeek: 6,
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      },
      create: {
        userId: "older-brother",
        familyId: "family-1",
        profileName: "Older Brother",
        track: "dse",
        schoolStage: "f3",
        studyMinutesPerDay: 50,
        studyDaysPerWeek: 6,
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      }
    });
    expect(result).toEqual({
      status: "success",
      message: "Older Brother profile saved."
    });
  });
});
