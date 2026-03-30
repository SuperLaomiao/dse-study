"use server";

import type { ProfileActionState } from "@/lib/action-states";
import { getCurrentSession } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { validateLearnerProfileInput } from "@/lib/profile-flow";
import { saveLearnerProfile } from "@/lib/repositories/profile-repository";

export async function saveLearnerProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
) {
  const locale = await getRequestLocale();
  const payload = {
    profileName: String(formData.get("profileName") ?? ""),
    track: String(formData.get("track") ?? ""),
    schoolStage: String(formData.get("schoolStage") ?? ""),
    studyMinutesPerDay: String(formData.get("studyMinutesPerDay") ?? ""),
    studyDaysPerWeek: String(formData.get("studyDaysPerWeek") ?? ""),
    targetReferenceLevel: String(formData.get("targetReferenceLevel") ?? ""),
    targetInternalBand: String(formData.get("targetInternalBand") ?? "")
  };

  const validation = validateLearnerProfileInput(payload, locale);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies ProfileActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: pickLocale(locale, {
        zh: `${payload.profileName} 档案已通过校验，下一步可以写入数据库。`,
        en: `${payload.profileName} profile is valid and ready for database persistence.`
      })
    } satisfies ProfileActionState;
  }

  const session = await getCurrentSession();

  if (!session || session.role !== "learner") {
    return {
      status: "error",
      message: pickLocale(locale, {
        zh: "请先以学习者身份登录，再保存档案。",
        en: "Sign in as a learner before saving a profile."
      })
    } satisfies ProfileActionState;
  }

  try {
    const profile = await saveLearnerProfile({
      userId: session.userId,
      profileName: payload.profileName.trim(),
      track: payload.track as "dse" | "foundation_to_dse" | "companion",
      schoolStage: payload.schoolStage as "p5" | "f3" | "adult" | "other",
      studyMinutesPerDay: Number(payload.studyMinutesPerDay),
      studyDaysPerWeek: Number(payload.studyDaysPerWeek),
      targetReferenceLevel: payload.targetReferenceLevel.trim(),
      targetInternalBand: payload.targetInternalBand.trim()
    });

    if (!profile) {
      return {
        status: "error",
        message: pickLocale(locale, {
          zh: "请先加入家庭，再保存学习者档案。",
          en: "Join a family before saving your learner profile."
        })
      } satisfies ProfileActionState;
    }

    return {
      status: "success",
      message: pickLocale(locale, {
        zh: `${payload.profileName.trim()} 档案已保存。`,
        en: `${payload.profileName.trim()} profile saved.`
      })
    } satisfies ProfileActionState;
  } catch (error) {
    console.error("save learner profile action failed", error);
    return {
      status: "error",
      message: pickLocale(locale, {
        zh: "当前暂时无法保存学习者档案。",
        en: "Unable to save the learner profile right now."
      })
    } satisfies ProfileActionState;
  }
}
