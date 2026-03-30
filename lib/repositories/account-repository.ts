import type { DemoAuthUser, SessionUser } from "@/lib/auth/session";
import {
  findDemoUserByCredentials,
  findDemoUserByEmail,
  findDemoUserById
} from "@/lib/auth/session";
import {
  comparePassword as comparePasswordValue,
  hashPassword as hashPasswordValue
} from "@/lib/auth/password";
import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";

const DEFAULT_ADMIN_EMAIL = "mom@example.com";
const DEFAULT_LEARNER_EMAILS = ["brother@example.com", "sister@example.com"];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeInviteCode(inviteCode: string) {
  const normalized = inviteCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "FAMILY";
}

function buildInviteToken(inviteCode: string, email: string) {
  const localPart = normalizeEmail(email).split("@")[0] ?? "LEARNER";
  const learnerCode = localPart
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${inviteCode}-${learnerCode || "LEARNER"}`;
}

function buildFallbackDisplayName(email: string) {
  const localPart = normalizeEmail(email).split("@")[0] ?? "Learner";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function mapDatabaseRole(role: "mom_admin" | "learner" | undefined): SessionUser["role"] | null {
  if (role === "mom_admin") {
    return "admin";
  }

  if (role === "learner") {
    return "learner";
  }

  return null;
}

export async function hashPassword(password: string) {
  return hashPasswordValue(password);
}

export async function comparePassword(password: string, passwordHash: string) {
  return comparePasswordValue(password, passwordHash);
}

export async function findSignInUserByEmail(email: string): Promise<DemoAuthUser | null> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  if (getDataAccessMode() !== "database") {
    return findDemoUserByEmail(normalizedEmail);
  }

  const databaseUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
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

  if (databaseUser) {
    const primaryMembership = databaseUser.memberships[0];
    const mappedRole = mapDatabaseRole(primaryMembership?.role);
    const demoUser = findDemoUserByEmail(normalizedEmail);

    if (mappedRole) {
      return {
        userId: databaseUser.id,
        role: mappedRole,
        email: databaseUser.email,
        name: databaseUser.displayName
      };
    }

    if (demoUser) {
      return {
        userId: databaseUser.id,
        role: demoUser.role,
        email: databaseUser.email,
        name: databaseUser.displayName
      };
    }

    return null;
  }

  const demoUser = findDemoUserByEmail(normalizedEmail);

  if (!demoUser) {
    return null;
  }

  const persistedUser = await prisma.user.upsert({
    where: {
      email: demoUser.email
    },
    update: {
      displayName: demoUser.name
    },
    create: {
      id: demoUser.userId,
      email: demoUser.email,
      displayName: demoUser.name
    }
  });

  return {
    userId: persistedUser.id,
    role: demoUser.role,
    email: persistedUser.email,
    name: persistedUser.displayName
  };
}

export async function createFamilySetup(input: {
  familyName: string;
  parentName: string;
  email: string;
  passwordHash: string;
  session: SessionUser | null;
}) {
  const inviteCode = normalizeInviteCode(input.familyName);
  const sessionDemoUser = input.session ? findDemoUserById(input.session.userId) : null;
  const adminEmail = normalizeEmail(input.email || sessionDemoUser?.email || DEFAULT_ADMIN_EMAIL);
  const adminId = sessionDemoUser?.userId;
  const inviteExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const family = await prisma.$transaction(async (tx) => {
    const adminUser = await tx.user.upsert({
      where: {
        email: adminEmail
      },
      update: {
        displayName: input.parentName,
        passwordHash: input.passwordHash
      },
      create: {
        ...(adminId ? { id: adminId } : {}),
        email: adminEmail,
        displayName: input.parentName,
        passwordHash: input.passwordHash
      }
    });

    const existingFamily = await tx.family.findFirst({
      where: {
        createdByUserId: adminUser.id
      }
    });

    const familyRecord = existingFamily
      ? await tx.family.update({
          where: {
            id: existingFamily.id
          },
          data: {
            name: input.familyName
          }
        })
      : await tx.family.create({
          data: {
            name: input.familyName,
            createdByUserId: adminUser.id
          }
        });

    await tx.familyMembership.upsert({
      where: {
        familyId_userId: {
          familyId: familyRecord.id,
          userId: adminUser.id
        }
      },
      update: {
        role: "mom_admin",
        status: "active"
      },
      create: {
        familyId: familyRecord.id,
        userId: adminUser.id,
        role: "mom_admin",
        status: "active"
      }
    });

    await tx.familyInvite.deleteMany({
      where: {
        familyId: familyRecord.id,
        acceptedAt: null
      }
    });

    await tx.familyInvite.createMany({
      data: DEFAULT_LEARNER_EMAILS.map((email) => ({
        familyId: familyRecord.id,
        email,
        role: "learner",
        inviteToken: buildInviteToken(inviteCode, email),
        expiresAt: inviteExpiry
      }))
    });

    return familyRecord;
  });

  return {
    family,
    inviteCode
  };
}

export async function verifyUserCredentials(input: {
  email: string;
  password: string;
}): Promise<(DemoAuthUser & { preferredUiLanguage: string }) | null> {
  const normalizedEmail = normalizeEmail(input.email);

  if (!normalizedEmail || !input.password.trim()) {
    return null;
  }

  if (getDataAccessMode() !== "database") {
    const user = findDemoUserByCredentials(normalizedEmail, input.password);
    if (!user) return null;
    // Demo users default to en
    return { ...user, preferredUiLanguage: "en" };
  }

  const databaseUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
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

  if (!databaseUser?.passwordHash) {
    return null;
  }

  const passwordMatches = await comparePassword(input.password, databaseUser.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  const primaryMembership = databaseUser.memberships[0];
  const mappedRole = mapDatabaseRole(primaryMembership?.role);
  const demoUser = findDemoUserByEmail(normalizedEmail);

  if (mappedRole) {
    return {
      userId: databaseUser.id,
      role: mappedRole,
      email: databaseUser.email,
      name: databaseUser.displayName,
      preferredUiLanguage: databaseUser.preferredUiLanguage
    };
  }

  if (demoUser) {
    return {
      userId: databaseUser.id,
      role: demoUser.role,
      email: databaseUser.email,
      name: databaseUser.displayName,
      preferredUiLanguage: databaseUser.preferredUiLanguage
    };
  }

  return null;
}

export async function joinFamilyMembership(input: {
  email: string;
  inviteCode: string;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const inviteCode = normalizeInviteCode(input.inviteCode);
  const learner = findDemoUserByEmail(normalizedEmail);

  const result = await prisma.$transaction(async (tx) => {
    const invite = await tx.familyInvite.findFirst({
      where: {
        email: normalizedEmail,
        acceptedAt: null,
        expiresAt: {
          gt: new Date()
        },
        inviteToken: {
          startsWith: inviteCode
        }
      },
      include: {
        family: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!invite) {
      return null;
    }

    const user = await tx.user.upsert({
      where: {
        email: normalizedEmail
      },
      update: {
        displayName: learner?.name ?? buildFallbackDisplayName(normalizedEmail)
      },
      create: {
        ...(learner ? { id: learner.userId } : {}),
        email: normalizedEmail,
        displayName: learner?.name ?? buildFallbackDisplayName(normalizedEmail)
      }
    });

    await tx.familyMembership.upsert({
      where: {
        familyId_userId: {
          familyId: invite.familyId,
          userId: user.id
        }
      },
      update: {
        role: "learner",
        status: "active"
      },
      create: {
        familyId: invite.familyId,
        userId: user.id,
        role: "learner",
        status: "active"
      }
    });

    await tx.familyInvite.update({
      where: {
        id: invite.id
      },
      data: {
        acceptedAt: new Date()
      }
    });

    return {
      familyName: invite.family.name,
      userId: user.id
    };
  });

  return result;
}
