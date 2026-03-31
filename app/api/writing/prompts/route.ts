
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getAllWritingPrompts } from "@/lib/repositories/writing-repository";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prompts = await getAllWritingPrompts();
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Failed to get writing prompts:", error);
    return NextResponse.json({ error: "Failed to get prompts" }, { status: 500 });
  }
}
