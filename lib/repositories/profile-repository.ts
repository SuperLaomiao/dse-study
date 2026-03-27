import { getDataAccessMode } from "@/lib/db";
import { getDemoLearnerProfileByUserId, getDemoLearnerProfiles } from "@/lib/data/profiles";
import { prisma } from "@/lib/prisma";

export async function getLearnerProfileByUserId(userId: string) {
  if (getDataAccessMode() === "database") {
    const profile = await prisma.learnerProfile.findUnique({
      where: {
        userId
      }
    });

    return profile;
  }

  return getDemoLearnerProfileByUserId(userId);
}

export async function listLearnerProfiles() {
  if (getDataAccessMode() === "database") {
    return prisma.learnerProfile.findMany({
      orderBy: {
        profileName: "asc"
      }
    });
  }

  return getDemoLearnerProfiles();
}
