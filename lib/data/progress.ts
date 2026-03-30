import type { LearnerProgressStats, VocabularyStats, SpeakingStats, ReadingStats, ListeningStats, WritingStats, BiWeeklyReviewStats, ActivityItem } from "@/lib/repositories/progress-repository";
import type { Locale } from "@/lib/i18n/config";

export function getDemoProgressStats(locale: Locale = "en"): LearnerProgressStats {
  const vocabulary: VocabularyStats = {
    totalLearned: 128,
    totalMastered: 87,
    todayPracticed: 15,
    streakDays: 5
  };

  const speaking: SpeakingStats = {
    totalPracticed: 64,
    averageScore: 82.5,
    todayPracticed: 8
  };

  const reading: ReadingStats = {
    totalPractices: 12,
    averageScore: 72.3,
    todayPracticed: 1
  };

  const listening: ListeningStats = {
    totalPractices: 8,
    averageScore: 75.2,
    todayPracticed: 1
  };

  const writing: WritingStats = {
    totalPractices: 5,
    averageScore: 3.4,
    todayPracticed: 1,
    totalWords: 1250
  };

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      type: "vocabulary",
      date: today,
      details: "perspective"
    },
    {
      id: "2",
      type: "reading",
      date: today,
      details: "The Importance of Sleep",
      score: 75
    },
    {
      id: "3",
      type: "speaking",
      date: today,
      details: "What do you think about...",
      score: 85
    },
    {
      id: "4",
      type: "vocabulary",
      date: today,
      details: "nevertheless"
    },
    {
      id: "5",
      type: "vocabulary",
      date: yesterday,
      details: "accomplish"
    },
    {
      id: "6",
      type: "reading",
      date: yesterday,
      details: "Social Media and Mental Health",
      score: 80
    },
    {
      id: "7",
      type: "speaking",
      date: yesterday,
      details: "I would like to discuss...",
      score: 79
    },
    {
      id: "8",
      type: "vocabulary",
      date: yesterday,
      details: "approximately"
    },
    {
      id: "9",
      type: "speaking",
      date: twoDaysAgo,
      details: "In my opinion,...",
      score: 88
    },
    {
      id: "10",
      type: "vocabulary",
      date: twoDaysAgo,
      details: "nevertheless"
    }
  ];

  let recommendation = "";
  if (locale === "zh") {
    recommendation = "进度不错，已经掌握了不少词汇，继续保持每天练习，争取延长连续学习天数。";
  } else {
    recommendation = "Good progress so far. You've mastered many words. Keep practicing daily to extend your learning streak.";
  }

  const totalItems = vocabulary.totalLearned + speaking.totalPracticed + reading.totalPractices + listening.totalPractices + writing.totalPractices;
  const totalMasteredItems = vocabulary.totalMastered + 
    Math.round((speaking.averageScore / 100) * speaking.totalPracticed) + 
    Math.round((reading.averageScore / 100) * reading.totalPractices) +
    Math.round((listening.averageScore / 100) * listening.totalPractices) +
    Math.round((writing.averageScore / 5) * writing.totalPractices);
  const overallProgress = totalItems > 0 
    ? Math.round((totalMasteredItems / totalItems) * 100)
    : 0;

  const biWeeklyToday = new Date();
  const twoWeeksAgo = new Date(biWeeklyToday.getTime() - 14 * 24 * 60 * 60 * 1000);
  const nextReview = new Date(biWeeklyToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  const biWeeklyReview: BiWeeklyReviewStats = {
    totalReviews: 3,
    averageScore: 78.5,
    totalItemsReviewed: 89,
    lastReview: twoWeeksAgo,
    nextReview: nextReview
  };

  return {
    vocabulary,
    speaking,
    reading,
    listening,
    writing,
    biWeeklyReview,
    recentActivities,
    summary: {
      overallProgress,
      recommendation
    }
  };
}
