import { pickLocale, type Locale } from "@/lib/i18n/config";
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
}, locale: Locale = "en"): ValidationResult {
  if (!input.profileName.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写档案名称。", en: "Profile name is required." }) };
  }

  if (!learnerTracks.has(input.track as LearnerTrack)) {
    return { ok: false, message: pickLocale(locale, { zh: "请先选择学习轨道。", en: "Track selection is required." }) };
  }

  if (!schoolStages.has(input.schoolStage as SchoolStage)) {
    return { ok: false, message: pickLocale(locale, { zh: "请先选择学段。", en: "School stage is required." }) };
  }

  const studyMinutesPerDay = Number(input.studyMinutesPerDay);
  if (!Number.isFinite(studyMinutesPerDay) || studyMinutesPerDay < 15 || studyMinutesPerDay > 120) {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "每日学习分钟数需要介于 15 到 120 分钟之间。",
        en: "Study minutes per day must be between 15 and 120."
      })
    };
  }

  const studyDaysPerWeek = Number(input.studyDaysPerWeek);
  if (!Number.isFinite(studyDaysPerWeek) || studyDaysPerWeek < 1 || studyDaysPerWeek > 7) {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "每周学习天数需要介于 1 到 7 天之间。",
        en: "Study days per week must be between 1 and 7."
      })
    };
  }

  if (!input.targetReferenceLevel.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写目标参考等级。", en: "Target reference level is required." }) };
  }

  if (!input.targetInternalBand.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写目标内部分段。", en: "Target internal band is required." }) };
  }

  return { ok: true };
}
