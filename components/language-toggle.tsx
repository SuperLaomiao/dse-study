"use client";

import { useState } from "react";

import {
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  type Locale
} from "@/lib/i18n/config";

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  const setLocale = async (nextLocale: Locale) => {
    if (nextLocale === locale || pendingLocale) {
      return;
    }

    setPendingLocale(nextLocale);

    try {
      // Save to backend to update user preference
      await fetch("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ locale: nextLocale })
      });
    } catch {
      // Fallback to just setting cookie if API fails
      document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    }

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      document.documentElement.lang = nextLocale === "zh" ? "zh-HK" : "en";
    } catch {
      // Keep the toggle usable even if browser storage is blocked.
    }

    window.location.reload();
  };

  return (
    <div
      aria-label={locale === "zh" ? "语言切换" : "Language switch"}
      className="inline-flex rounded-full border border-[var(--stroke-soft)] bg-white/75 p-1 shadow-[0_8px_18px_rgba(66,51,27,0.08)]"
    >
      <button
        type="button"
        aria-pressed={locale === "zh"}
        onClick={() => setLocale("zh")}
        disabled={pendingLocale !== null}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "zh"
            ? "bg-[var(--brand)] text-[var(--cream)]"
            : "text-[var(--brand-strong)] hover:bg-[var(--cream)]"
        } ${pendingLocale !== null ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        中文
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        disabled={pendingLocale !== null}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "en"
            ? "bg-[var(--brand)] text-[var(--cream)]"
            : "text-[var(--brand-strong)] hover:bg-[var(--cream)]"
        } ${pendingLocale !== null ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        EN
      </button>
    </div>
  );
}
