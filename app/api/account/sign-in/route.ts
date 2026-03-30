import { NextResponse } from "next/server";

import { validateSignInInput } from "@/lib/auth/account-flow";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/config";
import { getDataAccessMode } from "@/lib/db";
import { verifyUserCredentials } from "@/lib/repositories/account-repository";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? !email.trim()
        ? { ok: false as const, message: "Email is required." }
        : !password.trim()
          ? { ok: false as const, message: "Password is required." }
          : { ok: true as const }
      : validateSignInInput({ email, password });

  if (!validation.ok) {
    return redirectWithError(request, validation.message);
  }

  const user = await verifyUserCredentials({ email, password });

  if (!user) {
    return redirectWithError(
      request,
      getDataAccessMode() === "database"
        ? "Email or password is incorrect."
        : "Use one of the current demo emails to sign in."
    );
  }

  const response = NextResponse.redirect(
    new URL(getPostSignInRedirect(user.role), request.url)
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
