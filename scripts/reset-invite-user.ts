import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error("Usage: node --import tsx scripts/reset-invite-user.ts <email>");
  }

  const invite = await prisma.familyInvite.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" }
  });

  const user = await prisma.user.findUnique({
    where: { email }
  });

  await prisma.$transaction(async (tx) => {
    if (user) {
      await tx.speakingRecording.deleteMany({ where: { userId: user.id } });
      await tx.userSpeakingPractice.deleteMany({ where: { userId: user.id } });
      await tx.userVocabulary.deleteMany({ where: { userId: user.id } });
      await tx.userListeningPractice.deleteMany({ where: { userId: user.id } });
      await tx.userReadingPractice.deleteMany({ where: { userId: user.id } });
      await tx.userWritingPractice.deleteMany({ where: { userId: user.id } });
      await tx.biWeeklyReview.deleteMany({ where: { userId: user.id } });
      await tx.assessmentResult.deleteMany({ where: { userId: user.id } });
      await tx.learnerProfile.deleteMany({ where: { userId: user.id } });
      await tx.familyMembership.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    }

    if (invite) {
      await tx.familyInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: null }
      });
    }
  });

  console.log(
    JSON.stringify(
      {
        email,
        inviteReset: Boolean(invite),
        userDeleted: Boolean(user),
        token: invite?.inviteToken ?? null
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
