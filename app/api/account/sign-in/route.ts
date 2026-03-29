import { NextResponse } from "next/server";

import { validateSignInEmail } from "@/lib/auth/account-flow";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import { findSignInUserByEmail } from "@/lib/repositories/account-repository";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? email.trim()
        ? { ok: true as const }
        : { ok: false as const, message: "Email is required." }
      : validateSignInEmail(email);

  if (!validation.ok) {
    return redirectWithError(request, validation.message);
  }

  const user = await findSignInUserByEmail(email);

  if (!user) {
    return redirectWithError(
      request,
      getDataAccessMode() === "database"
        ? "No account was found for this email."
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

  return response;
}

function redirectWithError(request: Request, message: string) {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}
