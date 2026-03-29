import { getDataAccessMode } from "@/lib/db";
import { getDemoLearnerById } from "@/lib/data/learner";
import { getDemoLearnerProfileByUserId, getDemoLearnerProfiles } from "@/lib/data/profiles";
import { prisma } from "@/lib/prisma";

export interface AdminLearnerDetail {
  id: string;
  name: string;
  stage: string;
  track: string;
  internalBand: string;
  referenceLevel: string;
  studyMinutesPerDay: number;
  studyDaysPerWeek: number;
  focus: string[];
  dailyPlan: { title: string; detail: string }[];
}

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

export async function getAdminLearnerDetailById(userId: string): Promise<AdminLearnerDetail | null> {
  const demoLearner = getDemoLearnerById(userId);

  if (getDataAccessMode() === "database") {
    try {
      const profile = await prisma.learnerProfile.findUnique({
        where: {
          userId
        },
        include: {
          user: true
        }
      });

      if (profile) {
        return {
          id: profile.userId,
          name: profile.user.displayName,
          stage: profile.schoolStage.toUpperCase(),
          track:
            profile.track === "dse"
              ? "DSE Track"
              : profile.track === "foundation_to_dse"
                ? "Foundation to DSE"
                : "Companion",
          internalBand: profile.targetInternalBand,
          referenceLevel: profile.targetReferenceLevel,
          studyMinutesPerDay: profile.studyMinutesPerDay,
          studyDaysPerWeek: profile.studyDaysPerWeek,
          focus: demoLearner?.focus ?? [],
          dailyPlan: demoLearner?.dailyPlan ?? []
        };
      }
    } catch (error) {
      console.error("admin learner detail falling back to demo mode", error);
    }
  }

  const profile = getDemoLearnerProfileByUserId(userId);

  if (!demoLearner || !profile) {
    return null;
  }

  return {
    id: demoLearner.id,
    name: demoLearner.name,
    stage: demoLearner.stage,
    track: demoLearner.track,
    internalBand: profile.targetInternalBand,
    referenceLevel: profile.targetReferenceLevel,
    studyMinutesPerDay: profile.studyMinutesPerDay,
    studyDaysPerWeek: profile.studyDaysPerWeek,
    focus: demoLearner.focus,
    dailyPlan: demoLearner.dailyPlan
  };
}
