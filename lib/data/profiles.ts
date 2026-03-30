import type { Locale } from "@/lib/i18n/config";
import { demoLearnerProfiles, localizeLearnerProfileRecord } from "@/lib/demo-data";

export function getDemoLearnerProfiles(locale: Locale = "en") {
  return demoLearnerProfiles.map((profile) => localizeLearnerProfileRecord(profile, locale));
}

export function getDemoLearnerProfileByUserId(userId: string, locale: Locale = "en") {
  const profile = demoLearnerProfiles.find((item) => item.userId === userId) ?? null;
  return profile ? localizeLearnerProfileRecord(profile, locale) : null;
}
