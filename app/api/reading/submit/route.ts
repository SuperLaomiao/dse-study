import { NextResponse } from "next/server";
import { resolveRouteUser } from "@/lib/api-auth";
import { saveReadingPracticeResult } from "@/lib/repositories/reading-repository";

export async function POST(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
    const body = await request.json();
    const {
      readingPassageId,
      userAnswers,
      correctAnswers,
      totalQuestions,
      percentageScore,
    } = body ?? {};

    if (
      !readingPassageId ||
      !Array.isArray(userAnswers) ||
      typeof correctAnswers !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof percentageScore !== "number"
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await saveReadingPracticeResult({
      userId,
      readingPassageId,
      userAnswers,
      correctAnswers,
      totalQuestions,
      percentageScore,
    });

    return NextResponse.json({
      success: true,
      resultId: result.id,
    });
  } catch (error) {
    console.error("Error submitting reading practice:", error);
    return NextResponse.json({ error: "Failed to submit reading practice" }, { status: 500 });
  }
}
