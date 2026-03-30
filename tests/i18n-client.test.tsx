import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { getDocumentLocale, useI18n } from "@/lib/i18n/client";

describe("i18n client helper", () => {
  afterEach(() => {
    document.documentElement.lang = "en";
  });

  it("keeps dotted keys global even when a namespace is provided", () => {
    document.documentElement.lang = "zh";

    const { result } = renderHook(() => useI18n("reading"));

    expect(result.current("title")).toBe("阅读练习");
    expect(result.current("common.loading")).toBe("加载中...");
  });

  it("maps zh-HK to chinese locale", () => {
    document.documentElement.lang = "zh-HK";

    expect(getDocumentLocale()).toBe("zh");
  });
});
