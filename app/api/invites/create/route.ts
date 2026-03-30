import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocaleFromRequest } from "@/lib/i18n/server";
import { checkUserIsFamilyAdmin, createInvite, getFirstUserFamilyId } from "@/lib/repositories/invite-repository";
import type { FamilyRole } from "@prisma/client";

export async function POST(request: Request) {
  const locale = getRequestLocaleFromRequest(request);
  try {
    const session = await getCurrentSession();

    if (!session?.userId) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "未授权，请先登录。",
          en: "Unauthorized"
        })
      }, { status: 401 });
    }

    const body = await request.json();
    const { email, role = "learner", familyId } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "请填写有效邮箱。",
          en: "Valid email is required"
        })
      }, { status: 400 });
    }

    // Get the user's family if not provided
    let targetFamilyId = familyId;
    if (!targetFamilyId) {
      targetFamilyId = await getFirstUserFamilyId(session.userId);
    }

    if (!targetFamilyId) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "当前用户没有可用的家庭。",
          en: "No family found for this user"
        })
      }, { status: 404 });
    }

    // Check if user is admin of this family
    const isAdmin = await checkUserIsFamilyAdmin(targetFamilyId, session.userId);
    if (!isAdmin) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "只有家庭管理员可以创建邀请。",
          en: "Only family admins can create invites"
        })
      }, { status: 403 });
    }

    const result = await createInvite({
      familyId: targetFamilyId,
      email: email.trim().toLowerCase(),
      role: (role as FamilyRole) || "learner"
    });

    if (!result) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "创建邀请失败。",
          en: "Failed to create invite"
        })
      }, { status: 500 });
    }

    // Build the invite URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    const inviteUrl = `${baseUrl}/join/${result.inviteToken}`;

    return NextResponse.json({
      success: true,
      inviteToken: result.inviteToken,
      inviteUrl,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error("Create invite error:", error);
    return NextResponse.json({
      error: pickLocale(locale, {
        zh: "服务器内部错误。",
        en: "Internal server error"
      })
    }, { status: 500 });
  }
}
