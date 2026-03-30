"use client";

import { use } from "react";
import en from "../../i18n/en.json";
import zh from "../../i18n/zh.json";
import type { Locale } from "./config";

const translations = {
  en,
  zh
};

function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation missing for key: ${path}`);
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function useI18n(namespace?: string) {
  // Get locale from document (set by server)
  const getLocale = () => {
    if (typeof document !== "undefined") {
      const htmlLang = document.documentElement.lang;
      return (htmlLang === "zh" ? "zh" : "en") as Locale;
    }
    return "en" as Locale;
  };

  const locale = getLocale();
  const t = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getNestedTranslation(translations[locale], fullKey);
  };

  return t;
}

export function t(locale: Locale, key: string): string {
  return getNestedTranslation(translations[locale], key);
}
