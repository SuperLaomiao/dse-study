
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/server";
import { LOCALE_COOKIE_NAME, isLocale } from "@/lib/i18n/config";
import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locale } = await request.json();

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  // Update user preference in database if we're in database mode
  if (getDataAccessMode() === "database") {
    await prisma.user.update({
      where: { id: session.userId },
      data: { preferredUiLanguage: locale }
    });
  }

  const response = NextResponse.json({ success: true });
  
  // Set cookie for client-side
  response.cookies.set(
    LOCALE_COOKIE_NAME,
    locale,
    {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 31536000
    }
  );

  return response;
}
