import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import { LOCALE_COOKIE_NAME, pickLocale, resolveLocale } from "@/lib/i18n/config";

type RouteUserResolution =
  | { userId: string }
  | { response: NextResponse };

export async function resolveRouteUser(request: Request): Promise<RouteUserResolution> {
  const session = await getCurrentSession();

  if (session?.userId) {
    return { userId: session.userId };
  }

  if (getDataAccessMode() === "demo") {
    return { userId: "demo-user" };
  }

  const locale = resolveLocale(readCookie(request, LOCALE_COOKIE_NAME));
  return {
    response: NextResponse.json(
      {
        error: pickLocale(locale, {
          zh: "请先登录，再继续操作。",
          en: "Please sign in before continuing.",
        }),
      },
      { status: 401 },
    ),
  };
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
