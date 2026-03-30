"use client";

import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import type { LearnerProgressStats } from "@/lib/repositories/progress-repository";
import { Card } from "@/components/ui/card";

type Props = {
  locale: "en" | "zh";
  learnerId: string;
  learnerProfile: any;
  progressStats: LearnerProgressStats;
};

export function AdminLearnerProgressPageContent({
  locale,
  learnerId,
  learnerProfile,
  progressStats
}: Props) {
  const { vocabulary, speaking, reading, listening, recentActivities, summary } = progressStats;

  const formatDate = (date: Date) => {
    if (locale === "zh") {
      return new Intl.DateTimeFormat("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const getActivityTypeLabel = (type: "vocabulary" | "speaking" | "reading" | "listening" | "writing") => {
    if (locale === "zh") {
      if (type === "vocabulary") return "词汇";
      if (type === "speaking") return "口语";
      if (type === "reading") return "阅读";
      return "听力";
    }
    if (type === "vocabulary") return "Vocabulary";
    if (type === "speaking") return "Speaking";
    if (type === "reading") return "Reading";
    return "Listening";
  };

  const sections = [
    {
      title: pickLocale(locale, { zh: "学习统计", en: "Learning Statistics" }),
      content: (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)]">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--text-soft)] mb-4">
              {pickLocale(locale, { zh: "词汇", en: "Vocabulary" })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "已学习总数", en: "Total Learned" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{vocabulary.totalLearned}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "已掌握", en: "Mastered" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{vocabulary.totalMastered}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "今日练习", en: "Today's Practice" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{vocabulary.todayPracticed}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "连续学习天数", en: "Current Streak" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{vocabulary.streakDays}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)]">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--text-soft)] mb-4">
              {pickLocale(locale, { zh: "口语", en: "Speaking" })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "已练习总数", en: "Total Practiced" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{speaking.totalPracticed}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "平均分数", en: "Average Score" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{speaking.averageScore}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "今日练习", en: "Today's Practice" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{speaking.todayPracticed}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "掌握率", en: "Mastery Rate" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{summary.overallProgress}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)]">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--text-soft)] mb-4">
              {pickLocale(locale, { zh: "阅读", en: "Reading" })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "总练习次数", en: "Total Practices" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{reading.totalPractices}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "平均分数", en: "Average Score" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{reading.averageScore}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "今日练习", en: "Today's Practice" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{reading.todayPracticed}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "正确率", en: "Accuracy" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{reading.averageScore}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)]">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--text-soft)] mb-4">
              {pickLocale(locale, { zh: "听力", en: "Listening" })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "总练习次数", en: "Total Practices" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listening.totalPractices}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "平均分数", en: "Average Score" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listening.averageScore}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "今日练习", en: "Today's Practice" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listening.todayPracticed}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "正确率", en: "Accuracy" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{listening.averageScore}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)]">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--text-soft)] mb-4">
              {pickLocale(locale, { zh: "双周复习", en: "Bi-Weekly Review" })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "已完成次数", en: "Reviews Completed" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{progressStats.biWeeklyReview?.totalReviews || 0}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "平均分数", en: "Average Score" })}</p>
                <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
                  {(progressStats.biWeeklyReview?.averageScore || 0).toFixed(0)}
                  {(progressStats.biWeeklyReview?.totalReviews || 0) > 0 ? '%' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "上一次复习", en: "Last Review" })}</p>
                <p className="text-lg font-semibold text-[var(--foreground)] mt-1">
                  {progressStats.biWeeklyReview?.lastReview
                    ? new Date(progressStats.biWeeklyReview.lastReview).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
                    : pickLocale(locale, { zh: "暂无", en: "None" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{pickLocale(locale, { zh: "下次复习", en: "Next Review" })}</p>
                <p className="text-lg font-semibold text-[var(--foreground)] mt-1">
                  {progressStats.biWeeklyReview?.nextReview
                    ? new Date(progressStats.biWeeklyReview.nextReview).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
                    : pickLocale(locale, { zh: "待安排", en: "Pending" })}
                </p>
              </div>
            </div>
            {progressStats.biWeeklyReview && progressStats.biWeeklyReview.nextReview && new Date(progressStats.biWeeklyReview.nextReview) <= new Date() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800 font-medium">
                  {pickLocale(locale, { zh: "复习已到期", en: "Review is due now" })}
                </p>
              </div>
            )}
            <div className="mt-4">
              <a
                href="/review"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
              >
                {pickLocale(locale, { zh: "打开复习", en: "Open Review" })}
              </a>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: pickLocale(locale, { zh: "最近活动", en: "Recent Activities" }),
      content: (
        <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] py-4 text-center">
                {pickLocale(locale, { zh: "暂无练习记录", en: "No practice activities yet" })}
              </p>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl bg-white/80 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-medium text-[var(--brand)]">
                      {getActivityTypeLabel(activity.type)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{activity.details}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                  {activity.score !== undefined && (
                    <span className="text-sm font-semibold text-[var(--brand)]">
                      {activity.score.toFixed(0)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )
    },
    {
      title: pickLocale(locale, { zh: "进度总结", en: "Progress Summary" }),
      content: (
        <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(252,247,239,0.98),rgba(229,239,229,0.92))] p-5">
          <div className="mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
              {pickLocale(locale, { zh: "总体掌握率", en: "Overall Mastery" })}
            </p>
            <div className="mt-2 h-4 w-full rounded-full bg-[rgba(35,64,43,0.1)] overflow-hidden">
              <div
                className="h-full bg-[var(--brand)] rounded-full transition-all duration-500"
                style={{ width: `${summary.overallProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {summary.overallProgress}% {pickLocale(locale, { zh: "已掌握", en: "mastered" })}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-foreground)]">
            {summary.recommendation}
          </p>
          <div className="mt-4">
            <a
              href={`/admin/learner/${learnerProfile.id}`}
              className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
            >
              {pickLocale(locale, { zh: "返回学习者主页", en: "Back to Learner Profile" })}
            </a>
          </div>
        </div>
      )
    }
  ];

  const learnerName = learnerProfile.name || "Learner";

  return (
    <PlaceholderPage
      locale={locale}
      role="admin"
      title={locale === "zh" ? `${learnerName} 的学习进度` : `${learnerName}'s Progress`}
      description={
        locale === "zh"
          ? "查看详细的学习统计和进度分析"
          : "View detailed learning statistics and progress analysis"
      }
      sections={sections}
    />
  );
}
