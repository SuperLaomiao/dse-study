import { NextResponse } from "next/server";
import { resolveRouteUser } from "@/lib/api-auth";
import { saveListeningPracticeResult } from "@/lib/repositories/listening-repository";

export async function POST(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
    const body = await request.json();
    const {
      listeningExerciseId,
      userAnswers,
      correctAnswers,
      totalQuestions,
      percentageScore,
    } = body ?? {};

    if (
      !listeningExerciseId ||
      !Array.isArray(userAnswers) ||
      typeof correctAnswers !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof percentageScore !== "number"
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await saveListeningPracticeResult({
      userId,
      listeningExerciseId,
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
    console.error("Error submitting listening practice:", error);
    return NextResponse.json({ error: "Failed to submit listening practice" }, { status: 500 });
  }
}
