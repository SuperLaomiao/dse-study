import { NextResponse } from "next/server";

import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocaleFromRequest } from "@/lib/i18n/server";
import { getInviteByToken } from "@/lib/repositories/invite-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const locale = getRequestLocaleFromRequest(request);
  try {
    if (!token || token.length < 10) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "邀请链接无效。",
          en: "Invalid invite token"
        })
      }, { status: 400 });
    }

    const invite = await getInviteByToken(token);

    if (!invite) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "未找到这条邀请。",
          en: "Invite not found"
        })
      }, { status: 404 });
    }

    // Return safe invite info (don't expose internal ids)
    return NextResponse.json({
      email: invite.email,
      role: invite.role,
      familyName: invite.familyName,
      inviterName: invite.inviterName,
      expiresAt: invite.expiresAt,
      isValid: invite.isValid,
      isExpired: invite.isExpired,
      isAccepted: invite.isAccepted
    });
  } catch (error) {
    console.error("Get invite error:", error);
    return NextResponse.json({
      error: pickLocale(locale, {
        zh: "服务器内部错误。",
        en: "Internal server error"
      })
    }, { status: 500 });
  }
}
