
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const question = await prisma.grammarQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Failed to get grammar question:", error);
    return NextResponse.json({ error: "Failed to get question" }, { status: 500 });
  }
}
