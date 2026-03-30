import { NextResponse } from "next/server";
import { resolveRouteUser } from "@/lib/api-auth";
import { getDataAccessMode } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { getWritingPromptById } from "@/lib/data/writing";
import { gradeEssayWithAI, WritingGradingResult } from "@/lib/services/writing-grading";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }
    const { userId } = routeUser;

    const body = await request.json();
    const { promptId, essay } = body;

    if (!promptId || !essay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = await getWritingPromptById(promptId);
    if (!prompt) {
      return NextResponse.json({ error: "Writing prompt not found" }, { status: 404 });
    }

    // Grade the essay with AI
    const gradingResult = await gradeEssayWithAI(prompt, essay);

    // Save the practice result to database if in database mode
    if (getDataAccessMode() === "database") {
      try {
        await prisma.userWritingPractice.create({
          data: {
            userId: userId,
            writingPromptId: promptId,
            userEssay: essay,
            overallScore: gradingResult.overallScore,
            starRating: gradingResult.starRating,
            vocabularyFeedback: gradingResult.vocabulary,
            grammarFeedback: gradingResult.grammar,
            structureFeedback: gradingResult.structure,
            contentFeedback: gradingResult.content,
            suggestions: gradingResult.suggestions,
            corrections: gradingResult.corrections as any,
            feedbackJson: JSON.stringify(gradingResult)
          }
        });
      } catch (dbError) {
        console.error("Error saving writing practice to database:", dbError);
        // Still return the grading result even if save fails
      }
    }

    return NextResponse.json({
      success: true,
      result: gradingResult,
      prompt
    });
  } catch (error) {
    console.error("Error grading essay:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
