import { PrismaClient } from "@prisma/client";

export async function seedDatabase(prisma: PrismaClient) {
  const mom = await prisma.user.upsert({
    where: { email: "mom@example.com" },
    update: { displayName: "Mom Admin" },
    create: {
      id: "mom-admin",
      email: "mom@example.com",
      displayName: "Mom Admin"
    }
  });

  const family = await prisma.family.upsert({
    where: { id: "chan-family" },
    update: { name: "Chan Family", createdByUserId: mom.id },
    create: {
      id: "chan-family",
      name: "Chan Family",
      createdByUserId: mom.id
    }
  });

  const learners = [
    {
      id: "older-brother",
      email: "brother@example.com",
      displayName: "Older Brother",
      profile: {
        id: "profile-older-brother",
        profileName: "Older Brother",
        track: "dse" as const,
        schoolStage: "f3" as const,
        studyMinutesPerDay: 50,
        studyDaysPerWeek: 6,
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      }
    },
    {
      id: "younger-sister",
      email: "sister@example.com",
      displayName: "Younger Sister",
      profile: {
        id: "profile-younger-sister",
        profileName: "Younger Sister",
        track: "foundation_to_dse" as const,
        schoolStage: "p5" as const,
        studyMinutesPerDay: 40,
        studyDaysPerWeek: 6,
        targetReferenceLevel: "B1",
        targetInternalBand: "Band 3"
      }
    }
  ];

  for (const learner of learners) {
    const user = await prisma.user.upsert({
      where: { email: learner.email },
      update: { displayName: learner.displayName },
      create: {
        id: learner.id,
        email: learner.email,
        displayName: learner.displayName
      }
    });

    await prisma.familyMembership.upsert({
      where: {
        familyId_userId: {
          familyId: family.id,
          userId: user.id
        }
      },
      update: {
        role: "learner",
        status: "active"
      },
      create: {
        familyId: family.id,
        userId: user.id,
        role: "learner",
        status: "active"
      }
    });

    await prisma.learnerProfile.upsert({
      where: { userId: user.id },
      update: {
        profileName: learner.profile.profileName,
        track: learner.profile.track,
        schoolStage: learner.profile.schoolStage,
        studyMinutesPerDay: learner.profile.studyMinutesPerDay,
        studyDaysPerWeek: learner.profile.studyDaysPerWeek,
        targetReferenceLevel: learner.profile.targetReferenceLevel,
        targetInternalBand: learner.profile.targetInternalBand
      },
      create: {
        id: learner.profile.id,
        userId: user.id,
        familyId: family.id,
        profileName: learner.profile.profileName,
        track: learner.profile.track,
        schoolStage: learner.profile.schoolStage,
        studyMinutesPerDay: learner.profile.studyMinutesPerDay,
        studyDaysPerWeek: learner.profile.studyDaysPerWeek,
        targetReferenceLevel: learner.profile.targetReferenceLevel,
        targetInternalBand: learner.profile.targetInternalBand
      }
    });
  }

  await prisma.familyMembership.upsert({
    where: {
      familyId_userId: {
        familyId: family.id,
        userId: mom.id
      }
    },
    update: {
      role: "mom_admin",
      status: "active"
    },
    create: {
      familyId: family.id,
      userId: mom.id,
      role: "mom_admin",
      status: "active"
    }
  });
}

const isMainModule = process.argv[1]?.endsWith("prisma/seed.ts");

if (isMainModule) {
  const prisma = new PrismaClient();

  seedDatabase(prisma)
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
