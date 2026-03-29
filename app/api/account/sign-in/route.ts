import { NextResponse } from "next/server";

import { validateSignInEmail } from "@/lib/auth/account-flow";
import { findDemoUserByEmail, getPostSignInRedirect } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const validation = validateSignInEmail(email);

  if (!validation.ok) {
    return redirectWithError(request, validation.message);
  }

  const user = findDemoUserByEmail(email);

  if (!user) {
    return redirectWithError(request, "Use one of the current demo emails to sign in.");
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
