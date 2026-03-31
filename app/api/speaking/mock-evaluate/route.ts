
import { NextResponse } from "next/server";
import { getCurrentSession, requireServerRole } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob | null;
    const questionId = formData.get("questionId") as string;
    const prompt = formData.get("prompt") as string;

    if (!audio) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // TODO: Add actual speech-to-text and evaluation with AI
    // For now, return a placeholder evaluation
    const evaluation = {
      overall: 78,
      feedback: "Your pronunciation is clear overall. Work on intonation for question sentences and pause between ideas to improve fluency."
    };

    // Save the recording to database
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await prisma.speakingRecording.create({
      data: {
        userId: session.userId,
        questionId,
        prompt,
        audioData: buffer,
        overallScore: evaluation.overall,
        feedback: evaluation.feedback
      }
    });

    return NextResponse.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error("Failed to evaluate mock recording:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
