export const SUPPORTED_LOCALES = ["zh", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_COOKIE_NAME = "dse-study-locale";
export const LOCALE_STORAGE_KEY = "dse-study-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function pickLocale<T>(
  locale: Locale,
  values: {
    zh: T;
    en: T;
  }
): T {
  return values[locale];
}
