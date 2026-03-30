import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getDemoReadingPassages, getDemoReadingPassageById } from "@/lib/data/reading";
import type { ReadingPassageWithQuestions, Question } from "@/lib/data/reading";
import type { UserReadingPractice } from "@prisma/client";

export async function getAllReadingPassages(): Promise<ReadingPassageWithQuestions[]> {
  if (getDataAccessMode() === "demo") {
    return getDemoReadingPassages();
  }

  try {
    const passages = await prisma.readingPassage.findMany({
      orderBy: { difficultyLevel: "asc" }
    });

    return passages.map(p => ({
      ...p,
      questions: parseQuestions(p.questions)
    }));
  } catch (error) {
    console.error("Error getting reading passages, falling back to demo", error);
    return getDemoReadingPassages();
  }
}

export async function getReadingPassageById(id: string): Promise<ReadingPassageWithQuestions | null> {
  if (getDataAccessMode() === "demo") {
    return getDemoReadingPassageById(id);
  }

  try {
    const passage = await prisma.readingPassage.findUnique({
      where: { id }
    });

    if (!passage) return null;

    return {
      ...passage,
      questions: parseQuestions(passage.questions)
    };
  } catch (error) {
    console.error("Error getting reading passage", error);
    return getDemoReadingPassageById(id);
  }
}

function parseQuestions(questionsJson: any): Question[] {
  if (Array.isArray(questionsJson)) {
    return questionsJson as Question[];
  }
  try {
    return JSON.parse(questionsJson as string) as Question[];
  } catch {
    return [];
  }
}

export async function saveReadingPracticeResult(data: {
  userId: string;
  readingPassageId: string;
  userAnswers: number[];
  correctAnswers: number;
  totalQuestions: number;
  percentageScore: number;
}): Promise<UserReadingPractice> {
  if (getDataAccessMode() === "demo") {
    // In demo mode, just return a fake result
    return {
      id: `practice-${Date.now()}`,
      userId: data.userId,
      readingPassageId: data.readingPassageId,
      userAnswers: data.userAnswers as any,
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      percentageScore: data.percentageScore,
      completedAt: new Date()
    };
  }

  return prisma.userReadingPractice.create({
    data: {
      userId: data.userId,
      readingPassageId: data.readingPassageId,
      userAnswers: data.userAnswers as any,
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      percentageScore: data.percentageScore
    }
  });
}

export async function getUserReadingStats(userId: string): Promise<{
  totalPractices: number;
  averageScore: number;
  totalCorrect: number;
  totalQuestions: number;
}> {
  if (getDataAccessMode() === "demo") {
    // Return demo stats
    return {
      totalPractices: 0,
      averageScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  }

  try {
    const practices = await prisma.userReadingPractice.findMany({
      where: { userId }
    });

    if (practices.length === 0) {
      return {
        totalPractices: 0,
        averageScore: 0,
        totalCorrect: 0,
        totalQuestions: 0
      };
    }

    const totalPractices = practices.length;
    const totalCorrect = practices.reduce((sum, p) => sum + p.correctAnswers, 0);
    const totalQuestions = practices.reduce((sum, p) => sum + p.totalQuestions, 0);
    const averageScore = practices.reduce((sum, p) => sum + p.percentageScore, 0) / totalPractices;

    return {
      totalPractices,
      averageScore: Number(averageScore.toFixed(1)),
      totalCorrect,
      totalQuestions
    };
  } catch (error) {
    console.error("Error getting user reading stats", error);
    return {
      totalPractices: 0,
      averageScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  }
}

export async function groupPassagesByDifficulty(passages: ReadingPassageWithQuestions[]): Promise<Record<number, ReadingPassageWithQuestions[]>> {
  const grouped: Record<number, ReadingPassageWithQuestions[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };

  passages.forEach(passage => {
    if (grouped[passage.difficultyLevel]) {
      grouped[passage.difficultyLevel].push(passage);
    }
  });

  return grouped;
}
