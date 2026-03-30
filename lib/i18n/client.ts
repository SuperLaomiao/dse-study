"use client";

import { use } from "react";
import en from "../../i18n/en.json";
import zh from "../../i18n/zh.json";
import { resolveLocale, type Locale } from "./config";

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
  const locale = getDocumentLocale();
  const t = (key: string): string => {
    const fullKey = namespace && !key.includes(".") ? `${namespace}.${key}` : key;
    return getNestedTranslation(translations[locale], fullKey);
  };

  return t;
}

export function t(locale: Locale, key: string): string {
  return getNestedTranslation(translations[locale], key);
}

export function getDocumentLocale(): Locale {
  if (typeof document === "undefined") {
    return "en";
  }

  return resolveLocale(document.documentElement.lang.split("-")[0]);
}
