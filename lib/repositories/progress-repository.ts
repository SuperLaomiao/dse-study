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

export interface ActivityItem {
  id: string;
  type: "vocabulary" | "speaking";
  date: Date;
  details: string;
  score?: number;
}

export interface LearnerProgressStats {
  vocabulary: VocabularyStats;
  speaking: SpeakingStats;
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

      // Sort all activities by date descending
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      const recentActivities = activities.slice(0, 10);

      // Calculate overall progress and recommendation
      const overallProgress = totalLearned > 0 
        ? Number(((totalMastered / totalLearned) * 100).toFixed(1))
        : 0;

      let recommendation = "";
      if (locale === "zh") {
        if (streakDays >= 7) {
          recommendation = "太棒了！连续学习很棒，请继续保持这个好习惯。";
        } else if (overallProgress > 70) {
          recommendation = "进度不错，继续保持每天练习来巩固已学内容。";
        } else if (totalLearned > 50) {
          recommendation = "已经打下了良好的基础，建议增加每日练习量来加快进度。";
        } else {
          recommendation = "刚开始起步，建议每天坚持练习，养成良好的学习习惯。";
        }
      } else {
        if (streakDays >= 7) {
          recommendation = "Excellent! Great consistency with your daily learning. Keep it up!";
        } else if (overallProgress > 70) {
          recommendation = "Good progress! Keep practicing daily to reinforce what you've learned.";
        } else if (totalLearned > 50) {
          recommendation = "You've built a solid foundation. Consider increasing daily practice to speed up progress.";
        } else {
          recommendation = "You're just getting started. Keep practicing daily to build good learning habits.";
        }
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
