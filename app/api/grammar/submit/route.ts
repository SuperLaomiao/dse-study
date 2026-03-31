"use server";

import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId, userAnswer, isCorrect } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    // Save the practice result to database
    await prisma.userGrammarPractice.upsert({
      where: {
        userId_grammarQuestionId: {
          userId: session.userId,
          grammarQuestionId: questionId,
        },
      },
      update: {
        userAnswer,
        isCorrect,
      },
      create: {
        userId: session.userId,
        grammarQuestionId: questionId,
        userAnswer,
        isCorrect,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to submit grammar practice:", error);
    return NextResponse.json({ error: "Failed to submit practice" }, { status: 500 });
  }
}
