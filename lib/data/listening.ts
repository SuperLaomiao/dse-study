import { demoListeningExercises } from "@/lib/demo-listening";
import type { ListeningExercise, UserListeningPractice } from "@prisma/client";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  [key: string]: any;
}

export interface ListeningExerciseWithQuestions extends Omit<ListeningExercise, 'questions'> {
  questions: Question[];
}

export interface DemoListeningExercise {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  difficultyLevel: number;
  difficultyStar: string;
  questions: Question[];
  explanation?: string;
}

// Get all listening exercises for demo mode
export function getDemoListeningExercises(): ListeningExerciseWithQuestions[] {
  return demoListeningExercises.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    audioUrl: p.audioUrl,
    difficultyLevel: p.difficultyLevel,
    difficultyStar: p.difficultyStar,
    questions: p.questions,
    explanation: p.explanation ?? null,
    createdAt: new Date(),
    updatedAt: new Date()
  })) as ListeningExerciseWithQuestions[];
}

// Get a single listening exercise by id for demo mode
export function getDemoListeningExerciseById(id: string): ListeningExerciseWithQuestions | null {
  const exercise = demoListeningExercises.find(p => p.id === id);
  if (!exercise) return null;
  
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description ?? null,
    audioUrl: exercise.audioUrl,
    difficultyLevel: exercise.difficultyLevel,
    difficultyStar: exercise.difficultyStar,
    questions: exercise.questions,
    explanation: exercise.explanation ?? null,
    createdAt: new Date(),
    updatedAt: new Date()
  } as ListeningExerciseWithQuestions;
}
