import type { Locale } from "@/lib/i18n/config";
import { demoAdminSnapshot, localizeAdminSnapshot } from "@/lib/demo-data";

export function getDemoAdminSnapshot(locale: Locale = "en") {
  return localizeAdminSnapshot(demoAdminSnapshot, locale);
}
