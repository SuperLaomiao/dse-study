import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const family = await prisma.family.findFirst({
    include: {
      memberships: true
    }
  });

  const profile = await prisma.learnerProfile.findUnique({
    where: {
      userId: "older-brother"
    }
  });

  console.log(
    JSON.stringify(
      {
        familyName: family?.name,
        membershipCount: family?.memberships.length,
        profileName: profile?.profileName,
        profileTrack: profile?.track
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
