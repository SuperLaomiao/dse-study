
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { promptId, userEssay } = body;

    // Save the user's writing practice
    await prisma.userWritingPractice.create({
      data: {
        userId: session.userId,
        writingPromptId: promptId,
        userEssay,
      }
    });

    // TODO: Add AI scoring and feedback will be done during review

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to submit writing:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
