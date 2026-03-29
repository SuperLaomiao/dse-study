"use server";

import type { ProfileActionState } from "@/lib/action-states";
import { getCurrentSession } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import { validateLearnerProfileInput } from "@/lib/profile-flow";
import { saveLearnerProfile } from "@/lib/repositories/profile-repository";

export async function saveLearnerProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
) {
  const payload = {
    profileName: String(formData.get("profileName") ?? ""),
    track: String(formData.get("track") ?? ""),
    schoolStage: String(formData.get("schoolStage") ?? ""),
    studyMinutesPerDay: String(formData.get("studyMinutesPerDay") ?? ""),
    studyDaysPerWeek: String(formData.get("studyDaysPerWeek") ?? ""),
    targetReferenceLevel: String(formData.get("targetReferenceLevel") ?? ""),
    targetInternalBand: String(formData.get("targetInternalBand") ?? "")
  };

  const validation = validateLearnerProfileInput(payload);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies ProfileActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: `${payload.profileName} profile is valid and ready for database persistence.`
    } satisfies ProfileActionState;
  }

  const session = await getCurrentSession();

  if (!session || session.role !== "learner") {
    return {
      status: "error",
      message: "Sign in as a learner before saving a profile."
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
        message: "Join a family before saving your learner profile."
      } satisfies ProfileActionState;
    }

    return {
      status: "success",
      message: `${payload.profileName.trim()} profile saved.`
    } satisfies ProfileActionState;
  } catch (error) {
    console.error("save learner profile action failed", error);
    return {
      status: "error",
      message: "Unable to save the learner profile right now."
    } satisfies ProfileActionState;
  }
}
