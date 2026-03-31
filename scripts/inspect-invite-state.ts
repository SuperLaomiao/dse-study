import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const invites = await prisma.familyInvite.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { family: true }
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { memberships: true }
  });

  console.log(
    JSON.stringify(
      {
        invites: invites.map((invite) => ({
          id: invite.id,
          email: invite.email,
          token: invite.inviteToken,
          acceptedAt: invite.acceptedAt,
          expiresAt: invite.expiresAt,
          familyId: invite.familyId,
          familyName: invite.family?.name
        })),
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          createdAt: user.createdAt,
          memberships: user.memberships.map((membership) => ({
            familyId: membership.familyId,
            role: membership.role,
            status: membership.status
          }))
        }))
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
