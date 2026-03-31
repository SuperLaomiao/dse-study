
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerRole } from "@/lib/auth/server";

export async function GET() {
  await requireServerRole("learner");

  try {
    // Get 3 random mock questions for DSE speaking
    const questions = await prisma.speakingMockQuestion.findMany({
      take: 3,
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      questions: questions.map(q => ({
        id: q.id,
        questionNumber: q.questionNumber,
        prompt: q.prompt,
        preparationTime: q.preparationTime,
        responseTime: q.responseTime,
        topic: q.topic
      }))
    });
  } catch (error) {
    console.error("Failed to fetch mock questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
