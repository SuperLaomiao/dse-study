import { PrismaClient } from '@prisma/client';
import { calculateNextReview, ratingToQuality, isDueForReview } from '@/lib/spaced-repetition';
import type { Vocabulary, UserVocabulary } from '@prisma/client';
import { isDemoMode } from '@/lib/demo-mode';
import { demoVocabulary } from '@/lib/demo-vocabulary';

// Additional metadata for vocabulary words that exists in demo-vocabulary
export interface VocabularyMetadata {
  partOfSpeech: string;
  topic: string;
}

export const vocabularyMetadata: Record<string, VocabularyMetadata> = {
  achieve: { partOfSpeech: "verb", topic: "goals" },
  appear: { partOfSpeech: "verb", topic: "daily" },
  benefit: { partOfSpeech: "verb", topic: "health" },
  cause: { partOfSpeech: "verb", topic: "health" },
  chance: { partOfSpeech: "noun", topic: "opportunity" },
  change: { partOfSpeech: "noun", topic: "environment" },
  choose: { partOfSpeech: "verb", topic: "decision" },
  connect: { partOfSpeech: "verb", topic: "geography" },
  consider: { partOfSpeech: "verb", topic: "problem-solving" },
  continue: { partOfSpeech: "verb", topic: "sports" },
  control: { partOfSpeech: "verb", topic: "behavior" },
  develop: { partOfSpeech: "verb", topic: "technology" },
  different: { partOfSpeech: "adjective", topic: "opinion" },
  difficult: { partOfSpeech: "adjective", topic: "education" },
  effect: { partOfSpeech: "noun", topic: "policy" },
  environment: { partOfSpeech: "noun", topic: "protection" },
  experience: { partOfSpeech: "noun", topic: "education" },
  factor: { partOfSpeech: "noun", topic: "management" },
  focus: { partOfSpeech: "verb", topic: "work" },
  future: { partOfSpeech: "noun", topic: "planning" },
  adequate: { partOfSpeech: "adjective", topic: "supply" },
  analyze: { partOfSpeech: "verb", topic: "data" },
  approach: { partOfSpeech: "noun", topic: "problem-solving" },
  assess: { partOfSpeech: "verb", topic: "progress" },
  available: { partOfSpeech: "adjective", topic: "information" },
  avoid: { partOfSpeech: "verb", topic: "mistakes" },
  challenge: { partOfSpeech: "noun", topic: "personal" },
  concept: { partOfSpeech: "noun", topic: "thinking" },
};

const prisma = new PrismaClient();

export interface VocabularyWithProgress extends Vocabulary {
  userProgress: UserVocabulary | null;
}

export interface VocabularyStats {
  dueTodayCount: number;
  masteredCount: number;
  totalLearned: number;
}

// Check if we're in demo mode
export function useDemoMode(): boolean {
  return isDemoMode();
}

// Get all vocabulary by difficulty level
export async function getVocabularyByLevel(level: number): Promise<Vocabulary[]> {
  if (useDemoMode()) {
    return demoVocabulary.filter(v => v.difficultyLevel === level) as Vocabulary[];
  }
  return prisma.vocabulary.findMany({
    where: { difficultyLevel: level },
    orderBy: { word: 'asc' },
  });
}

// Get a single vocabulary by word
export async function getVocabularyByWord(word: string): Promise<Vocabulary | null> {
  if (useDemoMode()) {
    return demoVocabulary.find(v => v.word.toLowerCase() === word.toLowerCase()) ?? null;
  }
  return prisma.vocabulary.findUnique({
    where: { word },
  });
}

// Get user's vocabulary progress
export async function getUserVocabulary(
  userId: string,
  vocabularyId: string
): Promise<UserVocabulary | null> {
  if (useDemoMode()) {
    // In demo mode, return null (new word)
    return null;
  }
  return prisma.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
}

// Add new word to user's vocabulary
export async function addWordToUser(
  userId: string,
  vocabularyId: string
): Promise<UserVocabulary> {
  if (useDemoMode()) {
    // Return a fake demo record
    const now = new Date();
    return {
      id: 'demo-' + vocabularyId,
      userId,
      vocabularyId,
      difficulty: 0,
      repetitionCount: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReviewDate: now,
      lastReviewed: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  const today = new Date();
  return prisma.userVocabulary.create({
    data: {
      userId,
      vocabularyId,
      difficulty: 0,
      repetitionCount: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReviewDate: today,
    },
  });
}

// Process user rating and update next review date
export async function processRating(
  userVocabulary: UserVocabulary,
  rating: 'remember' | 'vague' | 'forgot'
): Promise<UserVocabulary> {
  const quality = ratingToQuality(rating);
  const { newInterval, newEaseFactor, newRepetitionCount, nextReviewDate } = calculateNextReview({
    quality,
    previousRepetitionCount: userVocabulary.repetitionCount,
    previousInterval: userVocabulary.interval,
    previousEaseFactor: userVocabulary.easeFactor,
  });

  let difficulty = 0;
  if (rating === 'remember') {
    difficulty = 2; // mastered
  } else if (rating === 'vague') {
    difficulty = 1; // learning
  } else {
    difficulty = 0; // new/forgot
  }

  if (useDemoMode()) {
    return {
      ...userVocabulary,
      difficulty,
      repetitionCount: newRepetitionCount,
      easeFactor: newEaseFactor,
      interval: newInterval,
      nextReviewDate,
      lastReviewed: new Date(),
      updatedAt: new Date(),
    };
  }

  return prisma.userVocabulary.update({
    where: { id: userVocabulary.id },
    data: {
      difficulty,
      repetitionCount: newRepetitionCount,
      easeFactor: newEaseFactor,
      interval: newInterval,
      nextReviewDate,
      lastReviewed: new Date(),
    },
  });
}

// Get all vocabulary for a user with progress
export async function getUserVocabularyList(userId: string): Promise<VocabularyWithProgress[]> {
  if (useDemoMode()) {
    return demoVocabulary.map(v => ({
      ...v,
      userProgress: null,
    })) as VocabularyWithProgress[];
  }

  const results = await prisma.vocabulary.findMany({
    include: {
      userProgress: {
        where: { userId },
      },
    },
    orderBy: { difficultyLevel: 'asc' },
  });

  // Convert the array userProgress to single userProgress (should be at most one)
  return results.map(r => ({
    ...r,
    userProgress: r.userProgress.length > 0 ? r.userProgress[0] : null,
  }));
}

// Get due vocabulary for today
export async function getDueToday(userId: string, maxWords: number = 20): Promise<VocabularyWithProgress[]> {
  if (useDemoMode()) {
    // In demo mode, return first 10 words from level 1-3
    return demoVocabulary
      .filter(v => v.difficultyLevel <= 3)
      .slice(0, maxWords)
      .map(v => ({
        ...v,
        userProgress: null,
      }));
  }

  const dueList = await prisma.userVocabulary.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: new Date(),
      },
    },
    include: {
      vocabulary: true,
    },
    take: maxWords,
    orderBy: { nextReviewDate: 'asc' },
  });

  return dueList.map(item => ({
    ...item.vocabulary,
    userProgress: item,
  }));
}

// Get user's vocabulary statistics
export async function getVocabularyStats(userId: string): Promise<VocabularyStats> {
  if (useDemoMode()) {
    return {
      dueTodayCount: 8,
      masteredCount: 25,
      totalLearned: 50,
    };
  }

  const allUserVocab = await prisma.userVocabulary.findMany({
    where: { userId },
  });

  const dueTodayCount = allUserVocab.filter(uv => isDueForReview(uv.nextReviewDate)).length;
  const masteredCount = allUserVocab.filter(uv => uv.difficulty === 2).length;
  const totalLearned = allUserVocab.length;

  return {
    dueTodayCount,
    masteredCount,
    totalLearned,
  };
}

// Assign new words to user based on their level
export async function assignNewWordsToUser(
  userId: string,
  userLevel: number,
  count: number = 10
): Promise<void> {
  if (useDemoMode()) {
    // In demo mode, do nothing
    return;
  }

  // Get words at user's level that the user hasn't learned yet
  const availableWords = await prisma.vocabulary.findMany({
    where: {
      difficultyLevel: {
        gte: Math.max(1, userLevel - 1),
        lte: Math.min(5, userLevel + 1),
      },
      userProgress: {
        none: {
          userId,
        },
      },
    },
    orderBy: { difficultyLevel: 'asc' },
    take: count,
  });

  // Add them to user's vocabulary with next review today
  const today = new Date();
  for (const word of availableWords) {
    await prisma.userVocabulary.create({
      data: {
        userId,
        vocabularyId: word.id,
        difficulty: 0,
        repetitionCount: 0,
        easeFactor: 2.5,
        interval: 1,
        nextReviewDate: today,
      },
    });
  }
}

// Count total vocabulary in database by level
export async function countVocabularyByLevel(level: number): Promise<number> {
  if (useDemoMode()) {
    return demoVocabulary.filter(v => v.difficultyLevel === level).length;
  }
  return prisma.vocabulary.count({
    where: { difficultyLevel: level },
  });
}
