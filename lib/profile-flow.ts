import type { LearnerTrack, SchoolStage } from "@/lib/types";

type ValidationResult = { ok: true } | { ok: false; message: string };

const learnerTracks = new Set<LearnerTrack>(["dse", "foundation_to_dse", "companion"]);
const schoolStages = new Set<SchoolStage>(["p5", "f3", "adult", "other"]);

export function validateLearnerProfileInput(input: {
  profileName: string;
  track: string;
  schoolStage: string;
  studyMinutesPerDay: string;
  studyDaysPerWeek: string;
  targetReferenceLevel: string;
  targetInternalBand: string;
}): ValidationResult {
  if (!input.profileName.trim()) {
    return { ok: false, message: "Profile name is required." };
  }

  if (!learnerTracks.has(input.track as LearnerTrack)) {
    return { ok: false, message: "Track selection is required." };
  }

  if (!schoolStages.has(input.schoolStage as SchoolStage)) {
    return { ok: false, message: "School stage is required." };
  }

  const studyMinutesPerDay = Number(input.studyMinutesPerDay);
  if (!Number.isFinite(studyMinutesPerDay) || studyMinutesPerDay < 15 || studyMinutesPerDay > 120) {
    return {
      ok: false,
      message: "Study minutes per day must be between 15 and 120."
    };
  }

  const studyDaysPerWeek = Number(input.studyDaysPerWeek);
  if (!Number.isFinite(studyDaysPerWeek) || studyDaysPerWeek < 1 || studyDaysPerWeek > 7) {
    return {
      ok: false,
      message: "Study days per week must be between 1 and 7."
    };
  }

  if (!input.targetReferenceLevel.trim()) {
    return { ok: false, message: "Target reference level is required." };
  }

  if (!input.targetInternalBand.trim()) {
    return { ok: false, message: "Target internal band is required." };
  }

  return { ok: true };
}
