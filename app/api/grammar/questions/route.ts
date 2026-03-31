
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getAllGrammarQuestions } from "@/lib/repositories/grammar-repository";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await getAllGrammarQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Failed to get grammar questions:", error);
    return NextResponse.json({ error: "Failed to get questions" }, { status: 500 });
  }
}
