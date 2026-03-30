import PageCard from "@/components/page-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  await requireServerRole("learner");
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);
  const todayTaskCount = learner.dailyPlan.length;
  const focusCount = learner.focus.length;
  const nextTask = learner.dailyPlan[0];

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={learner.name}
      description={`${learner.stage} • ${learner.track} • ${pickLocale(locale, { zh: "参考等级", en: "Reference Level" })} ${learner.referenceLevel}`}
      currentPath="/home"
      sections={[
        {
          title: pickLocale(locale, { zh: "学习快照", en: "Learning snapshot" }),
          content: (
            <div className="space-y-4">
              <div className="rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#23402b_0%,#4d6842_62%,#738b65_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(255,250,243,0.72)]">
                  {pickLocale(locale, { zh: "今日主任务", en: "Today's lead block" })}
                </p>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {nextTask?.title ?? pickLocale(locale, { zh: "今天先保持节奏", en: "Stay in rhythm today" })}
                    </p>
                    <p className="mt-2 text-sm text-[rgba(255,250,243,0.84)] md:text-base">
                      {nextTask?.detail ??
                        pickLocale(locale, {
                          zh: "让今天的循环保持轻量、稳定，并聚焦一个可衡量的提升点。",
                          en: "Keep the cycle light, consistent, and focused on one measurable lift."
                        })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/practice"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand-strong)] shadow-[0_14px_28px_rgba(18,34,22,0.18)] transition hover:bg-white"
                    >
                      {pickLocale(locale, { zh: "开始练习", en: "Start practice" })}
                    </a>
                    <a
                      href="/progress"
                      className="inline-flex items-center justify-center rounded-full border border-[rgba(255,250,243,0.3)] bg-[rgba(255,250,243,0.1)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,250,243,0.18)]"
                    >
                      {pickLocale(locale, { zh: "查看进度", en: "Review progress" })}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "阶段", en: "Stage" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learner.stage}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{learner.track}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "今天", en: "Today" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{locale === "zh" ? `${todayTaskCount} 个任务` : `${todayTaskCount} tasks`}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{pickLocale(locale, { zh: "一段热身，加一组计时任务。", en: "One warm-up and one timed set." })}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "重点", en: "Focus" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{locale === "zh" ? `${focusCount} 个重点` : `${focusCount} priorities`}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {pickLocale(locale, { zh: "让下一轮循环保持聚焦、可重复。", en: "Keep the next cycle narrow and repeatable." })}
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "每日计划", en: "Daily Plan" }),
          content: (
            <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {learner.dailyPlan.map((task) => (
                <li key={task.title} className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "任务", en: "Task" })}</p>
                  <p className="mt-2 font-medium text-[var(--foreground)]">{task.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{task.detail}</p>
                </li>
              ))}
            </ul>
          )
        },
        {
          title: pickLocale(locale, { zh: "当前重点", en: "Current focus" }),
          content: (
            <div className="grid gap-2 md:grid-cols-2">
              {learner.focus.map((item) => (
                <PageCard key={item} title={item}>
                  <p>{pickLocale(locale, { zh: "把这项能力继续保留在下一轮日常循环里。", en: "Keep this skill inside the next daily cycle." })}</p>
                </PageCard>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
