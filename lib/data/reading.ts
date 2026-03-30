import { demoReadingPassages } from "@/lib/demo-reading";
import type { ReadingPassage, UserReadingPractice } from "@prisma/client";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  [key: string]: any;
}

export interface ReadingPassageWithQuestions extends Omit<ReadingPassage, 'questions'> {
  questions: Question[];
}

export interface DemoReadingPassage {
  id: string;
  title: string;
  content: string;
  difficultyLevel: number;
  difficultyStar: string;
  questions: Question[];
  explanation?: string;
}

// Get all reading passages for demo mode
export function getDemoReadingPassages(): ReadingPassageWithQuestions[] {
  return demoReadingPassages.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    difficultyLevel: p.difficultyLevel,
    difficultyStar: p.difficultyStar,
    questions: p.questions,
    explanation: p.explanation ?? null,
    createdAt: new Date(),
    updatedAt: new Date()
  })) as ReadingPassageWithQuestions[];
}

// Get a single reading passage by id for demo mode
export function getDemoReadingPassageById(id: string): ReadingPassageWithQuestions | null {
  const passage = demoReadingPassages.find(p => p.id === id);
  if (!passage) return null;
  
  return {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    difficultyLevel: passage.difficultyLevel,
    difficultyStar: passage.difficultyStar,
    questions: passage.questions,
    explanation: passage.explanation ?? null,
    createdAt: new Date(),
    updatedAt: new Date()
  } as ReadingPassageWithQuestions;
}
