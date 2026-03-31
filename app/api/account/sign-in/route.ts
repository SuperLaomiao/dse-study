import { NextResponse } from "next/server";

import { validateSignInInput } from "@/lib/auth/account-flow";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { LOCALE_COOKIE_NAME, pickLocale, resolveLocale } from "@/lib/i18n/config";
import { getDataAccessMode } from "@/lib/db";
import { verifyUserCredentials } from "@/lib/repositories/account-repository";

export async function POST(request: Request) {
  const locale = resolveLocale(readCookie(request, LOCALE_COOKIE_NAME));
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? !email.trim()
        ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) }
        : !password.trim()
          ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写密码。", en: "Password is required." }) }
          : { ok: true as const }
      : validateSignInInput({ email, password }, locale);

  if (!validation.ok) {
    return redirectWithError(request, validation.message);
  }

  const user = await verifyUserCredentials({ email, password });

  if (!user) {
    return redirectWithError(
      request,
      getDataAccessMode() === "database"
        ? pickLocale(locale, { zh: "邮箱或密码不正确。", en: "Email or password is incorrect." })
        : pickLocale(locale, {
            zh: "请使用当前演示账号邮箱之一登录。",
            en: "Use one of the current demo emails to sign in."
          })
    );
  }

  // Check for redirect parameter from invite
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");
  const finalRedirect = redirectTo && redirectTo.startsWith("/") 
    ? new URL(redirectTo, request.url).toString()
    : getPostSignInRedirect(user.role);

  const response = NextResponse.redirect(
    new URL(finalRedirect, request.url)
  );

  response.cookies.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({
      userId: user.userId,
      role: user.role
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    }
  );

  // Set locale cookie based on user preference
  response.cookies.set(
    LOCALE_COOKIE_NAME,
    user.preferredUiLanguage || "en",
    {
      httpOnly: false, // Allow JS access for client-side toggle
      sameSite: "lax",
      path: "/",
      maxAge: 31536000 // 1 year
    }
  );

  return response;
}

function redirectWithError(request: Request, message: string) {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
