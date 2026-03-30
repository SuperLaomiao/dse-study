import type { Locale } from "@/lib/i18n/config";
import { demoFamilySummary, localizeFamilySummary } from "@/lib/demo-data";

export function getDemoFamilySummary(locale: Locale = "en") {
  return localizeFamilySummary(demoFamilySummary, locale);
}
