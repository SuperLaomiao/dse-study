import { getDataAccessMode } from "@/lib/db";
import { getDemoLearnerProfileByUserId, getDemoLearnerProfiles } from "@/lib/data/profiles";
import { prisma } from "@/lib/prisma";

export async function getLearnerProfileByUserId(userId: string) {
  if (getDataAccessMode() === "database") {
    try {
      const profile = await prisma.learnerProfile.findUnique({
        where: {
          userId
        }
      });

      return profile;
    } catch (error) {
      console.error("profile repository falling back to demo mode", error);
    }
  }

  return getDemoLearnerProfileByUserId(userId);
}

export async function listLearnerProfiles() {
  if (getDataAccessMode() === "database") {
    try {
      return await prisma.learnerProfile.findMany({
        orderBy: {
          profileName: "asc"
        }
      });
    } catch (error) {
      console.error("profile list falling back to demo mode", error);
    }
  }

  return getDemoLearnerProfiles();
}
