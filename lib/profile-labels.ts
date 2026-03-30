import { pickLocale, type Locale } from "@/lib/i18n/config";
import type { LearnerTrack, SchoolStage } from "@/lib/types";

export function formatLearnerTrackLabel(track: LearnerTrack, locale: Locale = "en") {
  if (track === "dse") {
    return pickLocale(locale, { zh: "DSE 主轨", en: "DSE Track" });
  }

  if (track === "foundation_to_dse") {
    return pickLocale(locale, { zh: "基础衔接 DSE", en: "Foundation to DSE" });
  }

  return pickLocale(locale, { zh: "陪伴模式", en: "Companion" });
}

export function formatSchoolStageLabel(stage: SchoolStage, locale: Locale = "en") {
  if (stage === "p5") {
    return pickLocale(locale, { zh: "小五", en: "P5" });
  }

  if (stage === "f3") {
    return pickLocale(locale, { zh: "中三", en: "F3" });
  }

  if (stage === "adult") {
    return pickLocale(locale, { zh: "成人", en: "Adult" });
  }

  return pickLocale(locale, { zh: "其他", en: "Other" });
}

export function formatFamilyOverviewLabel(locale: Locale = "en") {
  return pickLocale(locale, { zh: "家庭总览", en: "Family Overview" });
}
