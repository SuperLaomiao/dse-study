import { getDataAccessMode } from "@/lib/db";
import { getDemoAdminSnapshot } from "@/lib/data/admin";
import { getDemoFamilySummary } from "@/lib/data/family";
import { getDemoLearners } from "@/lib/data/learner";
import { prisma } from "@/lib/prisma";

export async function getFamilyDashboardData() {
  if (getDataAccessMode() === "database") {
    const family = await prisma.family.findFirst({
      include: {
        createdByUser: true,
        memberships: {
          include: {
            user: {
              include: {
                learnerProfile: true
              }
            }
          }
        }
      }
    });

    if (family) {
      const learners = family.memberships
        .filter((membership) => membership.role === "learner" && membership.user.learnerProfile)
        .map((membership) => {
          const profile = membership.user.learnerProfile!;

          return {
            id: membership.user.id as "older-brother" | "younger-sister",
            name: membership.user.displayName,
            stage: profile.schoolStage.toUpperCase(),
            track:
              profile.track === "dse"
                ? "DSE Track"
                : profile.track === "foundation_to_dse"
                  ? "Foundation to DSE"
                  : "Companion",
            internalBand: profile.targetInternalBand,
            referenceLevel: profile.targetReferenceLevel,
            dailyPlan: [],
            focus: []
          };
        });

      return {
        snapshot: {
          familyLabel: "Family Overview",
          adminName: family.createdByUser.displayName,
          alerts: []
        },
        family: {
          familyName: family.name,
          adminName: family.createdByUser.displayName,
          learnerIds: learners.map((learner) => learner.id)
        },
        learners
      };
    }
  }

  return {
    snapshot: getDemoAdminSnapshot(),
    family: getDemoFamilySummary(),
    learners: getDemoLearners()
  };
}
