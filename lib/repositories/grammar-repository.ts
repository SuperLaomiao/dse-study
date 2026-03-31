
import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function getAllGrammarQuestions() {
  if (getDataAccessMode() !== "database") {
    return [];
  }

  try {
    const questions = await prisma.grammarQuestion.findMany({
      where: { active: true },
      orderBy: { difficultyLevel: "asc" }
    });

    return questions;
  } catch (error) {
    console.error("Error getting grammar questions", error);
    return [];
  }
}

export function getDefaultLearnerLevel(): number {
  // Get from learner profile later, default 3 (intermediate/DSE)
  return 3;
}
