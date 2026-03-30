import type { Locale } from "@/lib/i18n/config";
import { demoLearners, localizeLearnerSummary } from "@/lib/demo-data";

export function getDemoLearners(locale: Locale = "en") {
  return demoLearners.map((learner) => localizeLearnerSummary(learner, locale));
}

export function getDemoLearnerById(id: string, locale: Locale = "en") {
  const learner = demoLearners.find((item) => item.id === id) ?? null;
  return learner ? localizeLearnerSummary(learner, locale) : null;
}

export function getDefaultLearner(locale: Locale = "en") {
  return localizeLearnerSummary(demoLearners[0], locale);
}

export function getDefaultLearnerLevel(): number {
  // Default to level 3 (intermediate) for demo
  return 3;
}
