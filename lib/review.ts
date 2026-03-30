import { BiWeeklyReview } from '@prisma/client';
import { prisma } from './prisma';

// Get learner profile for user
export async function getLearnerProfile(userId: string) {
  return prisma.learnerProfile.findFirst({
    where: { userId },
  });
}

// Check if bi-weekly review is due
export async function getBiWeeklyReviewStatus(learnerProfileId: string, userId: string) {
  const learnerProfile = await prisma.learnerProfile.findUnique({
    where: { id: learnerProfileId },
    select: {
      lastBiWeeklyReview: true,
      nextBiWeeklyReview: true,
    },
  });

  const reviews = await prisma.biWeeklyReview.findMany({
    where: {
      userId,
      completedAt: { not: null },
    },
    select: {
      id: true,
      percentageScore: true,
      completedAt: true,
    },
  });

  const totalReviews = reviews.length;
  const averageScore = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.percentageScore || 0), 0) / reviews.length
    : null;

  const lastReviewDate = learnerProfile?.lastBiWeeklyReview;
  const nextReviewDate = learnerProfile?.nextBiWeeklyReview;
  const isDue = !nextReviewDate || new Date() >= new Date(nextReviewDate);

  return {
    isDue,
    lastReviewDate,
    nextReviewDate,
    totalReviews,
    averageScore,
  };
}

// Get summary of items to review
export async function getBiWeeklyReviewSummary(learnerProfileId: string, userId: string) {
  // Get vocabulary items that need review (difficulty < 2 or not mastered)
  const vocabToReview = await prisma.userVocabulary.findMany({
    where: {
      userId,
      difficulty: { lt: 2 },
      lastReviewed: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // within last 14 days
      },
    },
    include: {
      vocabulary: true,
    },
    take: 15,
  });

  // Get speaking phrases that need review (masteryLevel < 2)
  const phrasesToReview = await prisma.userSpeakingPractice.findMany({
    where: {
      userId,
      masteryLevel: { lt: 2 },
      lastReviewed: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // within last 14 days
      },
    },
    include: {
      speakingPhrase: true,
    },
    take: 10,
  });

  // Get incorrectly answered reading questions from past 14 days
  const readingPractices = await prisma.userReadingPractice.findMany({
    where: {
      userId,
      completedAt: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      readingPassage: true,
    },
  });

  const readingQuestionsToReview: any[] = [];
  readingPractices.forEach((practice: any) => {
    const userAnswers = practice.userAnswers as any[];
    const questions = practice.readingPassage.questions as any[];
    
    if (!userAnswers || !questions) return;

    questions.forEach((question: any, index: number) => {
      const userAnswer = userAnswers[index];
      if (userAnswer !== question.correctAnswer) {
        readingQuestionsToReview.push({
          question: question.question,
          correctAnswer: question.correctAnswer,
          options: question.options,
          passageTitle: practice.readingPassage.title,
          passageContext: question.context || null,
          originalPracticeId: practice.id,
        });
      }
    });
  });

  // Take up to 10 reading questions
  const limitedReadingQuestions = readingQuestionsToReview.slice(0, 10);

  return {
    vocabCount: vocabToReview.length,
    phraseCount: phrasesToReview.length,
    readingCount: limitedReadingQuestions.length,
    totalItems: vocabToReview.length + phrasesToReview.length + limitedReadingQuestions.length,
  };
}

// Generate a new bi-weekly review
export async function generateBiWeeklyReview(learnerProfileId: string, userId: string) {
  // Get vocabulary items that need review (difficulty < 2 or not mastered)
  const vocabToReview = await prisma.userVocabulary.findMany({
    where: {
      userId,
      difficulty: { lt: 2 },
      lastReviewed: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // within last 14 days
      },
    },
    include: {
      vocabulary: true,
    },
    take: 15,
  });

  // Get speaking phrases that need review (masteryLevel < 2)
  const phrasesToReview = await prisma.userSpeakingPractice.findMany({
    where: {
      userId,
      masteryLevel: { lt: 2 },
      lastReviewed: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // within last 14 days
      },
    },
    include: {
      speakingPhrase: true,
    },
    take: 10,
  });

  // Get incorrectly answered reading questions from past 14 days
  const readingPractices = await prisma.userReadingPractice.findMany({
    where: {
      userId,
      completedAt: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      readingPassage: true,
    },
  });

  const readingQuestionsToReview: any[] = [];
  readingPractices.forEach(practice => {
    const userAnswers = practice.userAnswers as any[];
    const questions = practice.readingPassage.questions as any[];
    
    if (!userAnswers || !questions) return;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer !== question.correctAnswer) {
        readingQuestionsToReview.push({
          question: question.question,
          correctAnswer: question.correctAnswer,
          options: question.options,
          passageTitle: practice.readingPassage.title,
          passageContext: question.context || null,
        });
      }
    });
  });

  // Take up to 10 reading questions
  const limitedReadingQuestions = readingQuestionsToReview.slice(0, 10);

  // Shuffle all questions for mixed order
  const allQuestions = await Promise.all([
    ...vocabToReview.map(async (v: any) => ({
      type: 'vocabulary' as const,
      id: v.id,
      word: v.vocabulary.word,
      definition: v.vocabulary.definition,
      options: generateMultipleChoiceOptions(v.vocabulary.definition, await getOtherVocabDefinitions(v.vocabulary.id)),
      userVocabularyId: v.id,
    })),
    ...phrasesToReview.map(async (p: any) => ({
      type: 'phrase' as const,
      id: p.id,
      phrase: p.speakingPhrase.phrase,
      translation: p.speakingPhrase.translation,
      options: generateMultipleChoiceOptions(p.speakingPhrase.translation, await getOtherPhraseTranslations(p.speakingPhraseId)),
      userPhraseId: p.id,
    })),
    ...limitedReadingQuestions.map((q: any) => Promise.resolve({
      type: 'reading' as const,
      ...q,
      options: q.options,
    })),
  ]);

  // Fisher-Yates shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  // Calculate next review date (14 days from now)
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 14);

  // Create the review
  const review = await prisma.biWeeklyReview.create({
    data: {
      userId,
      learnerProfileId,
      totalQuestions: allQuestions.length,
      correctAnswers: 0,
      percentageScore: 0,
      vocabCount: vocabToReview.length,
      phraseCount: phrasesToReview.length,
      readingCount: limitedReadingQuestions.length,
      vocabCorrect: 0,
      phraseCorrect: 0,
      readingCorrect: 0,
      nextReviewDate,
      reviewContent: {
        questions: allQuestions,
      },
    },
  });

  // Update learner profile
  await prisma.learnerProfile.update({
    where: { id: learnerProfileId },
    data: {
      nextBiWeeklyReview: nextReviewDate,
    },
  });

  return review;
}

// Get a review for taking
export async function getReviewForTaking(reviewId: string) {
  const review = await prisma.biWeeklyReview.findUnique({
    where: { id: reviewId },
  });

  return review;
}

// Submit a completed review and update mastery
export async function submitReview(reviewId: string, userId: string, answers: Record<number, string>) {
  const review = await prisma.biWeeklyReview.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error('Review not found');
  }

  const reviewContent = review.reviewContent as any;
  const questions = reviewContent.questions || [];

  let correctCount = 0;
  let vocabCorrect = 0;
  let phraseCorrect = 0;
  let readingCorrect = 0;
  let vocabCount = 0;
  let phraseCount = 0;
  let readingCount = 0;

  // Check each answer and update mastery
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = answers[i];
    let isCorrect = false;

    switch (question.type) {
      case 'vocabulary':
        vocabCount++;
        if (userAnswer === question.definition) {
          isCorrect = true;
          correctCount++;
          vocabCorrect++;
          // Increase difficulty if correct
          await updateVocabularyMastery(question.userVocabularyId, true);
        } else {
          await updateVocabularyMastery(question.userVocabularyId, false);
        }
        break;
      case 'phrase':
        phraseCount++;
        if (userAnswer === question.translation) {
          isCorrect = true;
          correctCount++;
          phraseCorrect++;
          // Increase mastery if correct
          await updatePhraseMastery(question.userPhraseId, true);
        } else {
          await updatePhraseMastery(question.userPhraseId, false);
        }
        break;
      case 'reading':
        readingCount++;
        if (userAnswer === question.correctAnswer) {
          isCorrect = true;
          correctCount++;
          readingCorrect++;
        }
        break;
    }
  }

  const percentageScore = (correctCount / questions.length) * 100;

  // Update the review with results
  const updatedReview = await prisma.biWeeklyReview.update({
    where: { id: reviewId },
    data: {
      completedAt: new Date(),
      correctAnswers: correctCount,
      percentageScore,
      vocabCorrect,
      phraseCorrect,
      readingCorrect,
    },
  });

  // Update learner profile
  await prisma.learnerProfile.update({
    where: { id: review.learnerProfileId },
    data: {
      lastBiWeeklyReview: new Date(),
      nextBiWeeklyReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    reviewId: updatedReview.id,
    percentageScore,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    vocabCount: review.vocabCount,
    vocabCorrect,
    phraseCount: review.phraseCount,
    phraseCorrect,
    readingCount: review.readingCount,
    readingCorrect,
    nextReviewDate: updatedReview.nextReviewDate,
  };
}

// Get review result
export async function getReviewResult(reviewId: string) {
  const review = await prisma.biWeeklyReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return null;
  }

  return {
    reviewId: review.id,
    percentageScore: review.percentageScore || 0,
    totalQuestions: review.totalQuestions,
    correctAnswers: review.correctAnswers,
    vocabCount: review.vocabCount,
    vocabCorrect: review.vocabCorrect,
    phraseCount: review.phraseCount,
    phraseCorrect: review.phraseCorrect,
    readingCount: review.readingCount,
    readingCorrect: review.readingCorrect,
    nextReviewDate: review.nextReviewDate,
    completedAt: review.completedAt,
  };
}

// Helper: Get other vocabulary definitions for multiple choice
async function getOtherVocabDefinitions(excludeId: string): Promise<string[]> {
  const otherVocab = await prisma.vocabulary.findMany({
    where: {
      id: { not: excludeId },
    },
    select: { definition: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return otherVocab.map(v => v.definition);
}

// Helper: Get other phrase translations for multiple choice
async function getOtherPhraseTranslations(excludeId: string): Promise<string[]> {
  const otherPhrases = await prisma.speakingPhrase.findMany({
    where: {
      id: { not: excludeId },
    },
    select: { translation: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return otherPhrases.map(p => p.translation);
}

// Helper: Generate multiple choice options including correct answer
function generateMultipleChoiceOptions(correct: string, others: string[]): string[] {
  const options = [correct, ...others.slice(0, 3)];
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Helper: Update vocabulary mastery based on review result
async function updateVocabularyMastery(userVocabularyId: string, correct: boolean) {
  const userVocab = await prisma.userVocabulary.findUnique({
    where: { id: userVocabularyId },
  });

  if (!userVocab) return;

  let newDifficulty = userVocab.difficulty;
  if (correct) {
    newDifficulty = Math.min(2, userVocab.difficulty + 1);
  } else {
    newDifficulty = Math.max(0, userVocab.difficulty - 1);
  }

  await prisma.userVocabulary.update({
    where: { id: userVocabularyId },
    data: {
      difficulty: newDifficulty,
      repetitionCount: { increment: 1 },
      lastReviewed: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Helper: Update phrase mastery based on review result
async function updatePhraseMastery(userPhraseId: string, correct: boolean) {
  const userPhrase = await prisma.userSpeakingPractice.findUnique({
    where: { id: userPhraseId },
  });

  if (!userPhrase) return;

  let newMastery = userPhrase.masteryLevel;
  if (correct) {
    newMastery = Math.min(2, userPhrase.masteryLevel + 1);
  } else {
    newMastery = Math.max(0, userPhrase.masteryLevel - 1);
  }

  await prisma.userSpeakingPractice.update({
    where: { id: userPhraseId },
    data: {
      masteryLevel: newMastery,
      repetitionCount: { increment: 1 },
      lastReviewed: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Get review statistics for parent dashboard
export async function getReviewStatistics(learnerProfileId: string, userId: string) {
  const reviews = await prisma.biWeeklyReview.findMany({
    where: {
      userId,
      learnerProfileId,
      completedAt: { not: null },
    },
    orderBy: { completedAt: 'desc' },
  });

  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageScore: 0,
      totalItemsReviewed: 0,
      lastReview: null,
      nextReview: null,
    };
  }

  const averageScore = reviews.reduce((sum: number, r: BiWeeklyReview) => sum + (r.percentageScore || 0), 0) / totalReviews;
  const totalItemsReviewed = reviews.reduce((sum: number, r: BiWeeklyReview) => sum + r.totalQuestions, 0);
  const lastReview = reviews[0]?.completedAt;
  const nextReview = await getNextReviewDate(learnerProfileId);

  return {
    totalReviews,
    averageScore,
    totalItemsReviewed,
    lastReview,
    nextReview,
  };
}

async function getNextReviewDate(learnerProfileId: string) {
  const profile = await prisma.learnerProfile.findUnique({
    where: { id: learnerProfileId },
    select: { nextBiWeeklyReview: true },
  });
  return profile?.nextBiWeeklyReview || null;
}
