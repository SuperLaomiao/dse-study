import { NextResponse } from "next/server";

import { getInviteByToken } from "@/lib/repositories/invite-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    if (!token || token.length < 10) {
      return NextResponse.json({ error: "Invalid invite token" }, { status: 400 });
    }

    const invite = await getInviteByToken(token);

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
