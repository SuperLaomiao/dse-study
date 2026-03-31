import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getDemoListeningExercises, getDemoListeningExerciseById } from "@/lib/data/listening";
import type { ListeningExerciseWithQuestions, Question } from "@/lib/data/listening";
import type { UserListeningPractice } from "@prisma/client";

export async function getAllListeningExercises(): Promise<ListeningExerciseWithQuestions[]> {
  if (getDataAccessMode() === "demo") {
    return getDemoListeningExercises();
  }

  try {
    const exercises = await prisma.listeningExercise.findMany({
      orderBy: { difficultyLevel: "asc" }
    });

    return exercises.map(p => ({
      ...p,
      questions: parseQuestions(p.questions)
    }));
  } catch (error) {
    console.error("Error getting listening exercises, falling back to demo", error);
    return getDemoListeningExercises();
  }
}

export async function getListeningExerciseById(id: string): Promise<ListeningExerciseWithQuestions | null> {
  if (getDataAccessMode() === "demo") {
    return getDemoListeningExerciseById(id);
  }

  try {
    const exercise = await prisma.listeningExercise.findUnique({
      where: { id }
    });

    if (!exercise) return null;

    return {
      ...exercise,
      questions: parseQuestions(exercise.questions)
    };
  } catch (error) {
    console.error("Error getting listening exercise", error);
    return getDemoListeningExerciseById(id);
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

export async function saveListeningPracticeResult(data: {
  userId: string;
  listeningExerciseId: string;
  userAnswers: number[];
  correctAnswers: number;
  totalQuestions: number;
  percentageScore: number;
}): Promise<UserListeningPractice> {
  if (getDataAccessMode() === "demo") {
    // In demo mode, just return a fake result
    return {
      id: `practice-${Date.now()}`,
      userId: data.userId,
      listeningExerciseId: data.listeningExerciseId,
      userAnswers: data.userAnswers as any,
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      percentageScore: data.percentageScore,
      completedAt: new Date()
    };
  }

  return prisma.userListeningPractice.create({
    data: {
      userId: data.userId,
      listeningExerciseId: data.listeningExerciseId,
      userAnswers: data.userAnswers as any,
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      percentageScore: data.percentageScore
    }
  });
}

export async function getUserListeningStats(userId: string): Promise<{
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
    const practices = await prisma.userListeningPractice.findMany({
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
    console.error("Error getting user listening stats", error);
    return {
      totalPractices: 0,
      averageScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  }
}

export async function groupExercisesByDifficulty(exercises: ListeningExerciseWithQuestions[]): Promise<Record<number, ListeningExerciseWithQuestions[]>> {
  const grouped: Record<number, ListeningExerciseWithQuestions[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };

  exercises.forEach(exercise => {
    if (grouped[exercise.difficultyLevel]) {
      grouped[exercise.difficultyLevel].push(exercise);
    }
  });

  return grouped;
}

export function getDefaultLearnerLevel(): number {
  // Get from learner profile in DB later, for now use 3 (intermediate) as default
  return 3;
}
