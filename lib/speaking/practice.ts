import { PrismaClient } from '@prisma/client';
import { calculateNextReview } from './spaced-repetition';

const prisma = new PrismaClient();

export interface SpeakingPhraseWithProgress {
  id: string;
  phrase: string;
  translation: string;
  phonetic: string | null;
  difficultyLevel: number;
  exampleSentence: string | null;
  userProgress: {
    id: string;
    masteryLevel: number;
    repetitionCount: number;
    nextReviewDate: Date;
    lastScore: number | null;
  } | null;
}

export async function getPracticePhrases(
  userId: string,
  userLevel: number,
  limit: number = 10
): Promise<SpeakingPhraseWithProgress[]> {
  // Get phrases that are due for review today from user progress
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const duePhrases = await prisma.userSpeakingPractice.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: today,
      },
    },
    include: {
      speakingPhrase: true,
    },
    orderBy: {
      nextReviewDate: 'asc',
    },
    take: limit,
  });

  const result: SpeakingPhraseWithProgress[] = duePhrases.map(up => ({
    id: up.speakingPhrase.id,
    phrase: up.speakingPhrase.phrase,
    translation: up.speakingPhrase.translation,
    phonetic: up.speakingPhrase.phonetic,
    difficultyLevel: up.speakingPhrase.difficultyLevel,
    exampleSentence: up.speakingPhrase.exampleSentence,
    userProgress: {
      id: up.id,
      masteryLevel: up.masteryLevel,
      repetitionCount: up.repetitionCount,
      nextReviewDate: up.nextReviewDate,
      lastScore: up.lastScore,
    },
  }));

  // If we still need more phrases, get new phrases that match the user's level
  if (result.length < limit) {
    const needed = limit - result.length;
    
    // Get all phrase ids already in user progress
    const existingPhraseIds = result.map(p => p.id);
    
    // Get new phrases matching user level (±1 level)
    const newPhrases = await prisma.speakingPhrase.findMany({
      where: {
        id: {
          notIn: existingPhraseIds,
        },
        difficultyLevel: {
          gte: Math.max(1, userLevel - 1),
          lte: Math.min(5, userLevel + 1),
        },
      },
      orderBy: {
        difficultyLevel: 'asc',
      },
      take: needed,
    });

    newPhrases.forEach(phrase => {
      result.push({
        id: phrase.id,
        phrase: phrase.phrase,
        translation: phrase.translation,
        phonetic: phrase.phonetic,
        difficultyLevel: phrase.difficultyLevel,
        exampleSentence: phrase.exampleSentence,
        userProgress: null,
      });
    });
  }

  return result;
}

export async function getUserStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalCount, dueTodayCount, masteredCount, mockExamCount] = await Promise.all([
    prisma.userSpeakingPractice.count({ where: { userId } }),
    prisma.userSpeakingPractice.count({
      where: {
        userId,
        nextReviewDate: { lte: today },
      },
    }),
    prisma.userSpeakingPractice.count({
      where: {
        userId,
        masteryLevel: 2, // mastered
      },
    }),
    prisma.speakingRecording.count({
      where: {
        userId,
        questionId: { not: null }, // mock exam recordings
      },
    }),
  ]);

  return {
    totalPracticed: totalCount,
    dueToday: dueTodayCount,
    mastered: masteredCount,
    mockExamCompleted: mockExamCount,
  };
}

export async function updateUserProgress(
  userId: string,
  speakingPhraseId: string,
  score: number
) {
  // Find existing or create new
  const existing = await prisma.userSpeakingPractice.findUnique({
    where: {
      userId_speakingPhraseId: {
        userId,
        speakingPhraseId,
      },
    },
  });

  const now = new Date();

  if (!existing) {
    // Create new entry
    const {
      newRepetitionCount,
      newEaseFactor,
      newInterval,
      nextReviewDate,
      newMasteryLevel,
    } = calculateNextReview({
      repetitionCount: 0,
      easeFactor: 2.5,
      interval: 0,
      score,
    });

    return await prisma.userSpeakingPractice.create({
      data: {
        userId,
        speakingPhraseId,
        masteryLevel: newMasteryLevel,
        repetitionCount: newRepetitionCount,
        easeFactor: newEaseFactor,
        interval: newInterval,
        nextReviewDate,
        lastScore: score,
        lastReviewed: now,
      },
    });
  }

  // Update existing entry
  const {
    newRepetitionCount,
    newEaseFactor,
    newInterval,
    nextReviewDate,
    newMasteryLevel,
  } = calculateNextReview({
    repetitionCount: existing.repetitionCount,
    easeFactor: existing.easeFactor,
    interval: existing.interval,
    score,
  });

  return await prisma.userSpeakingPractice.update({
    where: {
      id: existing.id,
    },
    data: {
      repetitionCount: newRepetitionCount,
      easeFactor: newEaseFactor,
      interval: newInterval,
      nextReviewDate,
      masteryLevel: newMasteryLevel,
      lastScore: score,
      lastReviewed: now,
      updatedAt: now,
    },
  });
}

export async function saveRecording(
  userPracticeId: string,
  userId: string,
  audioUrl: string,
  transcription: string | null,
  accuracyScore: number | null,
  stressScore: number | null,
  overallScore: number | null
) {
  return await prisma.speakingRecording.create({
    data: {
      userPracticeId,
      userId,
      audioUrl,
      transcription,
      accuracyScore,
      stressScore,
      overallScore,
    },
  });
}

export async function getAllUserPhrases(userId: string) {
  const progress = await prisma.userSpeakingPractice.findMany({
    where: { userId },
    include: {
      speakingPhrase: true,
    },
    orderBy: {
      nextReviewDate: 'asc',
    },
  });

  return progress.map(p => ({
    id: p.speakingPhrase.id,
    phrase: p.speakingPhrase.phrase,
    translation: p.speakingPhrase.translation,
    difficultyLevel: p.speakingPhrase.difficultyLevel,
    masteryLevel: p.masteryLevel,
    nextReviewDate: p.nextReviewDate,
    lastScore: p.lastScore,
  }));
}
