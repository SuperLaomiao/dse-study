import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, resolveLocale } from "@/lib/i18n/config";

describe("i18n config", () => {
  it("defaults to Chinese when locale is missing", () => {
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE);
    expect(resolveLocale("")).toBe("zh");
  });

  it("falls back to Chinese for unsupported locale values", () => {
    expect(resolveLocale("fr")).toBe("zh");
    expect(resolveLocale("en-US")).toBe("zh");
  });

  it("accepts supported locale values", () => {
    expect(resolveLocale("zh")).toBe("zh");
    expect(resolveLocale("en")).toBe("en");
  });
});
