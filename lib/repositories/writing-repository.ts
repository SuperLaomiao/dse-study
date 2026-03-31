
import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function getAllWritingPrompts() {
  if (getDataAccessMode() !== "database") {
    return [];
  }

  try {
    const prompts = await prisma.writingPrompt.findMany({
      where: { active: true },
      orderBy: { difficultyLevel: "asc" }
    });

    return prompts;
  } catch (error) {
    console.error("Error getting writing prompts", error);
    return [];
  }
}

export function getDefaultLearnerLevel(): number {
  // Get from learner profile later, default to 3 (intermediate/DSE)
  return 3;
}
