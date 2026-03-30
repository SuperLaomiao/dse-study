import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/server";
import { acceptInvite, getInviteByToken } from "@/lib/repositories/invite-repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const session = await getCurrentSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - please sign in first" }, { status: 401 });
    }

    const invite = await getInviteByToken(token);

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (!invite.isValid) {
      return NextResponse.json({
        error: invite.isExpired ? "Invite has expired" : "Invite has already been accepted"
      }, { status: 400 });
    }

    const success = await acceptInvite(token, session.userId);

    if (!success) {
      return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Invite accepted successfully",
      redirectTo: "/admin/dashboard"
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
