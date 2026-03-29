import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
