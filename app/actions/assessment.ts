"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/server";
import { updateLearnerProfileAssessment } from "@/lib/repositories/profile-repository";
import { AssessmentActionState } from "@/lib/action-states";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import fs from "fs";

export async function saveAssessmentResultAction(
  prevState: AssessmentActionState,
  formData: FormData
): Promise<AssessmentActionState> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return {
      status: "error",
      message: getMessage("errorUnauthorized", "Unauthorized")
    };
  }

  const locale = await getRequestLocale();
  const level = parseInt(formData.get("level") as string);
  const band = formData.get("band") as string;
  const correct = parseInt(formData.get("correct") as string);
  const total = parseInt(formData.get("total") as string);

  try {
    if (getDataAccessMode() === "database") {
      // Get learner profile id
      const profile = await prisma.learnerProfile.findUnique({
        where: { userId: session.userId }
      });

      if (profile) {
        // Save the assessment result record
        await prisma.assessmentResult.create({
          data: {
            userId: session.userId,
            learnerProfileId: profile.id,
            correctAnswers: correct,
            totalQuestions: total,
            calculatedLevel: level,
            calculatedBand: band
          }
        });
      }
    }

    // Update the profile with the latest result
    await updateLearnerProfileAssessment(session.userId, level.toString(), band);
  } catch (error) {
    console.error("Failed to save assessment result:", error);
    return {
      status: "error",
      message: getMessage("saveFailed", "Failed to save assessment result")
    };
  }

  redirect("/learn");
}

function getMessage(key: "errorUnauthorized" | "saveFailed", enDefault: string): string {
  const locale = "en"; // Will be caught by redirect anyway
  const en = JSON.parse(fs.readFileSync("i18n/en.json", "utf8"));
  const zh = JSON.parse(fs.readFileSync("i18n/zh.json", "utf8"));

  // Fallback messages
  const messages = {
    errorUnauthorized: {
      zh: "未授权，请重新登录",
      en: "Unauthorized, please sign in again"
    },
    saveFailed: {
      zh: "保存评估结果失败，请重试",
      en: "Failed to save assessment result, please try again"
    }
  } as const;

  return pickLocale(locale, {
    zh: messages[key].zh,
    en: messages[key].en
  });
}
