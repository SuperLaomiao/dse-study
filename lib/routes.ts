import { pickLocale, type Locale } from "@/lib/i18n/config";

export function getLearnerNavItems(locale: Locale) {
  return [
    { href: "/home", label: pickLocale(locale, { zh: "首页", en: "Home" }) },
    { href: "/learn", label: pickLocale(locale, { zh: "学习", en: "Learn" }) },
    { href: "/practice", label: pickLocale(locale, { zh: "练习", en: "Practice" }) },
    { href: "/progress", label: pickLocale(locale, { zh: "进度", en: "Progress" }) }
  ];
}

export function getAdminNavItems(locale: Locale) {
  return [
    { href: "/admin/family", label: pickLocale(locale, { zh: "家庭", en: "Family" }) },
    { href: "/admin/alerts", label: pickLocale(locale, { zh: "提醒", en: "Alerts" }) },
    { href: "/admin/system", label: pickLocale(locale, { zh: "系统", en: "System" }) }
  ];
}
