import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, resolveLocale, type Locale } from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    return resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getRequestLocaleFromRequest(request: Request): Locale {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const rawLocale = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.slice(LOCALE_COOKIE_NAME.length + 1);

  return resolveLocale(rawLocale);
}
