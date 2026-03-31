import { getDataAccessMode } from "@/lib/db";
import { getDemoAdminSnapshot } from "@/lib/data/admin";
import { getDemoFamilySummary } from "@/lib/data/family";
import { getDemoLearners } from "@/lib/data/learner";
import type { Locale } from "@/lib/i18n/config";
import {
  formatFamilyOverviewLabel,
  formatLearnerTrackLabel,
  formatSchoolStageLabel
} from "@/lib/profile-labels";
import { prisma } from "@/lib/prisma";

import { getCurrentSession } from "@/lib/auth/server";

export async function getFamilyDashboardData(locale: Locale = "en") {
  if (getDataAccessMode() === "database") {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new Error("No session");
      }
      
      const family = await prisma.family.findFirst({
        where: {
          createdByUserId: session.userId,
        },
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
              stage: formatSchoolStageLabel(profile.schoolStage, locale),
              track: formatLearnerTrackLabel(profile.track, locale),
              internalBand: profile.targetInternalBand,
              referenceLevel: profile.targetReferenceLevel,
              dailyPlan: [],
              focus: []
            };
          });

        return {
          snapshot: {
            familyLabel: formatFamilyOverviewLabel(locale),
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
    } catch (error) {
      console.error("family repository falling back to demo mode", error);
    }
  }

  return {
    snapshot: getDemoAdminSnapshot(locale),
    family: getDemoFamilySummary(locale),
    learners: getDemoLearners(locale)
  };
}
