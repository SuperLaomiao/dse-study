import type { LearnerProgressStats, VocabularyStats, SpeakingStats, ActivityItem } from "@/lib/repositories/progress-repository";
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
      type: "speaking",
      date: today,
      details: "What do you think about...",
      score: 85
    },
    {
      id: "3",
      type: "vocabulary",
      date: today,
      details: "nevertheless"
    },
    {
      id: "4",
      type: "vocabulary",
      date: yesterday,
      details: "accomplish"
    },
    {
      id: "5",
      type: "speaking",
      date: yesterday,
      details: "I would like to discuss...",
      score: 79
    },
    {
      id: "6",
      type: "vocabulary",
      date: yesterday,
      details: "approximately"
    },
    {
      id: "7",
      type: "speaking",
      date: twoDaysAgo,
      details: "In my opinion,...",
      score: 88
    },
    {
      id: "8",
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

  const overallProgress = vocabulary.totalLearned > 0 
    ? Math.round((vocabulary.totalMastered / vocabulary.totalLearned) * 100)
    : 0;

  return {
    vocabulary,
    speaking,
    recentActivities,
    summary: {
      overallProgress,
      recommendation
    }
  };
}
