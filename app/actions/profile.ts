"use server";

import type { ProfileActionState } from "@/lib/action-states";
import { validateLearnerProfileInput } from "@/lib/profile-flow";

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

  return {
    status: "success",
    message: `${payload.profileName} profile is valid and ready for database persistence.`
  } satisfies ProfileActionState;
}
