
import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocaleFromRequest } from "@/lib/i18n/server";
import { getInviteByToken, acceptInviteAfterCreateUser } from "@/lib/repositories/invite-repository";
import { prisma } from "@/lib/prisma";
import { buildFallbackDisplayName } from "@/lib/repositories/account-repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const locale = getRequestLocaleFromRequest(request);

  try {
    const body = await request.json();
    const password = body.password as string;

    if (!password || password.length < 6) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "密码至少需要6个字符",
          en: "Password must be at least 6 characters"
        })
      }, { status: 400 });
    }

    const invite = await getInviteByToken(token);
    if (!invite) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "邀请链接不存在或已过期",
          en: "Invite not found or expired"
        })
      }, { status: 404 });
    }

    if (!invite.isValid) {
      return NextResponse.json({
        error: invite.isExpired
          ? pickLocale(locale, { zh: "邀请已过期", en: "Invite expired" })
          : pickLocale(locale, { zh: "邀请已被接受", en: "Invite already accepted" })
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email }
    });

    if (existingUser) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "这个邮箱已经注册过了，请直接登录",
          en: "This email is already registered, please sign in"
        })
      }, { status: 400 });
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const displayName = buildFallbackDisplayName(invite.email);

    const user = await prisma.user.create({
      data: {
        email: invite.email,
        displayName,
        passwordHash,
        preferredUiLanguage: locale
      }
    });

    // Accept the invite and create membership
    await acceptInviteAfterCreateUser(token, user.id, invite.familyId);

    // Set session cookie and redirect
    const response = NextResponse.json({
      success: true,
      redirectTo: getPostSignInRedirect(invite.role === "learner" ? "learner" : "admin")
    });

    await setSessionCookie({
      userId: user.id,
      role: invite.role === "learner" ? "learner" : "admin",
      email: user.email,
      name: user.displayName
    });

    return response;
  } catch (error) {
    console.error("accept-with-password error:", error);
    return NextResponse.json({
      error: pickLocale(locale, {
        zh: "服务器错误，请重试",
        en: "Server error, please try again"
      })
    }, { status: 500 });
  }
}
