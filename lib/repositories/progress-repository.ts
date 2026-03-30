import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getDemoProgressStats } from "@/lib/data/progress";
import type { Locale } from "@/lib/i18n/config";

export interface VocabularyStats {
  totalLearned: number;
  totalMastered: number;
  todayPracticed: number;
  streakDays: number;
}

export interface SpeakingStats {
  totalPracticed: number;
  averageScore: number;
  todayPracticed: number;
}

export interface ReadingStats {
  totalPractices: number;
  averageScore: number;
  todayPracticed: number;
}

export interface ListeningStats {
  totalPractices: number;
  averageScore: number;
  todayPracticed: number;
}

export interface WritingStats {
  totalPractices: number;
  averageScore: number;
  todayPracticed: number;
  totalWords: number;
}

export interface BiWeeklyReviewStats {
  totalReviews: number;
  averageScore: number;
  totalItemsReviewed: number;
  lastReview: Date | null;
  nextReview: Date | null;
}

export interface ActivityItem {
  id: string;
  type: "vocabulary" | "speaking" | "reading" | "listening" | "writing";
  date: Date;
  details: string;
  score?: number;
}

export interface LearnerProgressStats {
  vocabulary: VocabularyStats;
  speaking: SpeakingStats;
  reading: ReadingStats;
  listening: ListeningStats;
  writing: WritingStats;
  biWeeklyReview?: BiWeeklyReviewStats;
  recentActivities: ActivityItem[];
  summary: {
    overallProgress: number;
    recommendation: string;
  };
}

export function calculateStreakDays(practiceDates: Date[]): number {
  if (practiceDates.length === 0) return 0;

  const sortedDates = practiceDates
    .map(d => new Date(d.toDateString()))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = today;

  const dateSet = new Set(sortedDates.map(d => d.getTime()));

  while (dateSet.has(currentDate.getTime())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export async function getLearnerProgressStats(
  learnerId: string,
  locale: Locale = "en"
): Promise<LearnerProgressStats> {
  if (getDataAccessMode() === "database") {
    try {
      // Get all vocabulary progress for the user
      const vocabularyProgress = await prisma.userVocabulary.findMany({
        where: { userId: learnerId },
        include: { vocabulary: true }
      });

      // Get all speaking progress for the user
      const speakingProgress = await prisma.userSpeakingPractice.findMany({
        where: { userId: learnerId },
        include: { recordings: true, speakingPhrase: true }
      });

      // Get all reading practice for the user
      const readingProgress = await prisma.userReadingPractice.findMany({
        where: { userId: learnerId },
        include: { readingPassage: true }
      });

      // Get all listening practice for the user
      const listeningProgress = await prisma.userListeningPractice.findMany({
        where: { userId: learnerId },
        include: { listeningExercise: true }
      });

      // Get all writing practice for the user
      const writingProgress = await prisma.userWritingPractice.findMany({
        where: { userId: learnerId },
        include: { writingPrompt: true }
      });

      // Calculate vocabulary stats
      const totalLearned = vocabularyProgress.length;
      const totalMastered = vocabularyProgress.filter(v => v.difficulty === 2).length;

      // Get today's date boundaries
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1);

      const todayPracticedVocab = vocabularyProgress.filter(v => 
        v.lastReviewed && v.lastReviewed >= startOfToday && v.lastReviewed <= endOfToday
      ).length;

      // Collect all practice dates for streak calculation
      const practiceDates = vocabularyProgress
        .filter(v => v.lastReviewed)
        .map(v => v.lastReviewed!);
      speakingProgress
        .filter(s => s.lastReviewed)
        .map(s => s.lastReviewed!)
        .forEach(d => practiceDates.push(d));
      readingProgress
        .map(r => r.completedAt)
        .forEach(d => practiceDates.push(d));
      listeningProgress
        .map(l => l.completedAt)
        .forEach(d => practiceDates.push(d));
      writingProgress
        .map(w => w.completedAt)
        .forEach(d => practiceDates.push(d));

      const streakDays = calculateStreakDays(practiceDates);

      // Calculate speaking stats
      const totalPracticed = speakingProgress.length;
      const allScores = speakingProgress
        .filter(s => s.lastScore !== null)
        .map(s => s.lastScore!);
      const averageScore = allScores.length > 0 
        ? Number((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1))
        : 0;

      const todayPracticedSpeaking = speakingProgress.filter(s =>
        s.lastReviewed && s.lastReviewed >= startOfToday && s.lastReviewed <= endOfToday
      ).length;

      // Calculate reading stats
      const totalPracticesReading = readingProgress.length;
      const allReadingScores = readingProgress.map(r => r.percentageScore);
      const averageScoreReading = allReadingScores.length > 0
        ? Number((allReadingScores.reduce((a, b) => a + b, 0) / allReadingScores.length).toFixed(1))
        : 0;

      const todayPracticedReading = readingProgress.filter(r =>
        r.completedAt >= startOfToday && r.completedAt <= endOfToday
      ).length;

      // Calculate listening stats
      const totalPracticesListening = listeningProgress.length;
      const allListeningScores = listeningProgress.map(l => l.percentageScore);
      const averageScoreListening = allListeningScores.length > 0
        ? Number((allListeningScores.reduce((a, b) => a + b, 0) / allListeningScores.length).toFixed(1))
        : 0;

      const todayPracticedListening = listeningProgress.filter(l =>
        l.completedAt >= startOfToday && l.completedAt <= endOfToday
      ).length;

      // Calculate writing stats
      const totalPracticesWriting = writingProgress.length;
      const allWritingScores = writingProgress.map(w => w.overallScore);
      const averageScoreWriting = allWritingScores.length > 0
        ? Number((allWritingScores.reduce((a, b) => a + b, 0) / allWritingScores.length).toFixed(1))
        : 0;

      const todayPracticedWriting = writingProgress.filter(w =>
        w.completedAt >= startOfToday && w.completedAt <= endOfToday
      ).length;

      // Calculate total words written
      const totalWordsWriting = writingProgress.reduce((sum, w) => {
        const wordCount = w.userEssay.trim().split(/\s+/).length;
        return sum + wordCount;
      }, 0);

      // Get recent activities
      const activities: ActivityItem[] = [];

      vocabularyProgress
        .filter(v => v.lastReviewed)
        .sort((a, b) => (b.lastReviewed?.getTime() || 0) - (a.lastReviewed?.getTime() || 0))
        .slice(0, 5)
        .forEach(v => {
          activities.push({
            id: v.id,
            type: "vocabulary",
            date: v.lastReviewed!,
            details: v.vocabulary.word
          });
        });

      speakingProgress
        .filter(s => s.lastReviewed)
        .sort((a, b) => (b.lastReviewed?.getTime() || 0) - (a.lastReviewed?.getTime() || 0))
        .slice(0, 5)
        .forEach(s => {
          activities.push({
            id: s.id,
            type: "speaking",
            date: s.lastReviewed!,
            details: (s as any).speakingPhrase?.phrase || "Phrase practice",
            score: s.lastScore ?? undefined
          });
        });

      readingProgress
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, 5)
        .forEach(r => {
          activities.push({
            id: r.id,
            type: "reading",
            date: r.completedAt,
            details: (r as any).readingPassage?.title || "Reading practice",
            score: r.percentageScore
          });
        });

      listeningProgress
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, 5)
        .forEach(l => {
          activities.push({
            id: l.id,
            type: "listening",
            date: l.completedAt,
            details: (l as any).listeningExercise?.title || "Listening practice",
            score: l.percentageScore
          });
        });

      writingProgress
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, 5)
        .forEach(w => {
          activities.push({
            id: w.id,
            type: "writing",
            date: w.completedAt,
            details: (w as any).writingPrompt?.title || "Writing practice",
            score: w.overallScore * 20 // Convert 1-5 to 20-100 percentage
          });
        });

      // Sort all activities by date descending
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      const recentActivities = activities.slice(0, 10);

      // Calculate overall progress and recommendation
      const totalItems = totalLearned + totalPracticed + totalPracticesReading + totalPracticesListening + totalPracticesWriting;
      const totalMasteredItems = totalMastered + 
        Math.round((averageScore / 100) * totalPracticed) + 
        Math.round((averageScoreReading / 100) * totalPracticesReading) +
        Math.round((averageScoreListening / 100) * totalPracticesListening) +
        Math.round((averageScoreWriting / 5) * totalPracticesWriting);
      const overallProgress = totalItems > 0 
        ? Number(((totalMasteredItems / totalItems) * 100).toFixed(1))
        : 0;

      let recommendation = "";
      if (locale === "zh") {
        if (streakDays >= 7) {
          recommendation = "太棒了！连续学习很棒，请继续保持这个好习惯。";
        } else if (overallProgress > 70) {
          recommendation = "进度不错，继续保持每天练习来巩固已学内容。";
        } else if (totalItems > 50) {
          recommendation = "已经打下了良好的基础，建议增加每日练习量来加快进度。";
        } else {
          recommendation = "刚开始起步，建议每天坚持练习，养成良好的学习习惯。";
        }
      } else {
        if (streakDays >= 7) {
          recommendation = "Excellent! Great consistency with your daily learning. Keep it up!";
        } else if (overallProgress > 70) {
          recommendation = "Good progress! Keep practicing daily to reinforce what you've learned.";
        } else if (totalItems > 50) {
          recommendation = "You've built a solid foundation. Consider increasing daily practice to speed up progress.";
        } else {
          recommendation = "You're just getting started. Keep practicing daily to build good learning habits.";
        }
      }

      // Get bi-weekly review stats
      const completedReviews = await prisma.biWeeklyReview.findMany({
        where: {
          userId: learnerId,
          completedAt: { not: null }
        },
        orderBy: { completedAt: 'desc' }
      });

      const learnerProfile = await prisma.learnerProfile.findFirst({
        where: { userId: learnerId },
        select: { lastBiWeeklyReview: true, nextBiWeeklyReview: true }
      });

      let biWeeklyReviewStats: BiWeeklyReviewStats | undefined;
      if (completedReviews.length > 0 || learnerProfile) {
        const totalReviews = completedReviews.length;
        const averageScore = totalReviews > 0
          ? completedReviews.reduce((sum, r) => sum + (r.percentageScore || 0), 0) / totalReviews
          : 0;
        const totalItemsReviewed = completedReviews.reduce((sum, r) => sum + r.totalQuestions, 0);
        const lastReview = completedReviews.length > 0 ? completedReviews[0].completedAt : (learnerProfile?.lastBiWeeklyReview || null);
        const nextReview = learnerProfile?.nextBiWeeklyReview || null;

        biWeeklyReviewStats = {
          totalReviews,
          averageScore,
          totalItemsReviewed,
          lastReview,
          nextReview
        };
      }

      return {
        vocabulary: {
          totalLearned,
          totalMastered,
          todayPracticed: todayPracticedVocab,
          streakDays
        },
        speaking: {
          totalPracticed,
          averageScore,
          todayPracticed: todayPracticedSpeaking
        },
        reading: {
          totalPractices: totalPracticesReading,
          averageScore: averageScoreReading,
          todayPracticed: todayPracticedReading
        },
        listening: {
          totalPractices: totalPracticesListening,
          averageScore: averageScoreListening,
          todayPracticed: todayPracticedListening
        },
        writing: {
          totalPractices: totalPracticesWriting,
          averageScore: averageScoreWriting,
          todayPracticed: todayPracticedWriting,
          totalWords: totalWordsWriting
        },
        biWeeklyReview: biWeeklyReviewStats,
        recentActivities,
        summary: {
          overallProgress,
          recommendation
        }
      };
    } catch (error) {
      console.error("Error getting learner progress stats, falling back to demo", error);
    }
  }

  return getDemoProgressStats(locale);
}
