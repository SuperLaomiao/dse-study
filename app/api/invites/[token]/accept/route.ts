import { NextResponse } from "next/server";

import { getPostSignInRedirect } from "@/lib/auth/session";
import { getCurrentSession } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocaleFromRequest } from "@/lib/i18n/server";
import { acceptInvite, getInviteByToken } from "@/lib/repositories/invite-repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const locale = getRequestLocaleFromRequest(request);
  try {
    const session = await getCurrentSession();

    if (!session?.userId) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "请先登录，再接受邀请。",
          en: "Unauthorized - please sign in first"
        })
      }, { status: 401 });
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

    if (!invite.isValid) {
      return NextResponse.json({
        error: invite.isExpired
          ? pickLocale(locale, {
              zh: "邀请已过期。",
              en: "Invite has expired"
            })
          : pickLocale(locale, {
              zh: "邀请已经被接受。",
              en: "Invite has already been accepted"
            })
      }, { status: 400 });
    }

    const success = await acceptInvite(token, session.userId);

    if (!success) {
      return NextResponse.json({
        error: pickLocale(locale, {
          zh: "接受邀请失败。",
          en: "Failed to accept invite"
        })
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: pickLocale(locale, {
        zh: "邀请接受成功。",
        en: "Invite accepted successfully"
      }),
      redirectTo: getPostSignInRedirect(invite.role === "learner" ? "learner" : "admin")
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json({
      error: pickLocale(locale, {
        zh: "服务器内部错误。",
        en: "Internal server error"
      })
    }, { status: 500 });
  }
}
