import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoAdminSnapshot } from "@/lib/data/admin";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";
import { getAdminLearnerDetailById } from "@/lib/repositories/profile-repository";

export default async function AdminLearnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireServerRole("admin");
  const { id } = await params;
  const locale = await getRequestLocale();
  const { learners } = await getFamilyDashboardData(locale);
  const learner = await getAdminLearnerDetailById(id, locale);
  const localizedSnapshot = getDemoAdminSnapshot(locale);
  const sourceSnapshot = getDemoAdminSnapshot("en");
  const learnerAlerts = localizedSnapshot.alerts.filter((_, index) =>
    `${sourceSnapshot.alerts[index]?.title ?? ""} ${sourceSnapshot.alerts[index]?.detail ?? ""}`
      .toLowerCase()
      .includes(id.replace("-", " "))
  );

  if (!learner) {
    return (
      <PlaceholderPage
        locale={locale}
        role="admin"
        title={pickLocale(locale, { zh: "未找到学习者", en: "Learner not found" })}
        description={pickLocale(locale, {
          zh: "当前演示数据中不存在请求的学习者记录。",
          en: "The requested learner record is missing from the current demo dataset."
        })}
        sections={[
          {
            title: pickLocale(locale, { zh: "下一步", en: "Next step" }),
            content: (
              <a href="/admin/family">
                {pickLocale(locale, { zh: "返回家庭总览", en: "Back to Family Overview" })}
              </a>
            )
          }
        ]}
      />
    );
  }

  const currentLearnerIndex = learners.findIndex((member) => member.id === learner.id);
  const previousLearner =
    currentLearnerIndex > 0 ? learners[currentLearnerIndex - 1] : null;
  const nextLearner =
    currentLearnerIndex >= 0 && currentLearnerIndex < learners.length - 1
      ? learners[currentLearnerIndex + 1]
      : null;

  return (
    <PlaceholderPage
      locale={locale}
      role="admin"
      title={learner.name}
      description={`${learner.stage} • ${learner.track}`}
      sections={[
        {
          title: pickLocale(locale, { zh: "学习节奏", en: "Study cadence" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <MetricCard
                label={pickLocale(locale, { zh: "时长", en: "Time" })}
                value={locale === "zh" ? `${learner.studyMinutesPerDay} 分钟/天` : `${learner.studyMinutesPerDay} min/day`}
              />
              <MetricCard
                label={pickLocale(locale, { zh: "频率", en: "Rhythm" })}
                value={locale === "zh" ? `${learner.studyDaysPerWeek} 天/周` : `${learner.studyDaysPerWeek} days/week`}
              />
              <MetricCard
                label={pickLocale(locale, { zh: "水平", en: "Level" })}
                value={locale === "zh" ? `${learner.referenceLevel} 当前` : `${learner.referenceLevel} now`}
              />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "目标轨迹", en: "Target trajectory" }),
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">
                  {pickLocale(locale, { zh: "当前参考水平", en: "Current reference" })}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.referenceLevel}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, {
                    zh: "当前正稳定朝下一档水平推进。",
                    en: "Working steadily toward the next band jump."
                  })}
                </p>
              </article>
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">
                  {pickLocale(locale, { zh: "内部目标", en: "Internal target" })}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.internalBand}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, {
                    zh: "用这个目标来校准任务难度与复盘负荷。",
                    en: "Use this target to calibrate task difficulty and review load."
                  })}
                </p>
              </article>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "当前重点", en: "Current focus" }),
          content: (
            <ul className="grid gap-2 md:grid-cols-2">
              {learner.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-[18px] bg-[rgba(246,241,231,0.62)] px-4 py-3 text-sm font-medium text-[#314531]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )
        },
        {
          title: pickLocale(locale, { zh: "口语 AI 观察", en: "Speaking AI watch" }),
          content: learner.speakingInsight ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1.05fr_1.2fr]">
                <article className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">
                    {pickLocale(locale, { zh: "最近一次练习", en: "Most recent drill" })}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.speakingInsight.taskLabel}</p>
                  <p className="mt-1 text-sm text-[#435443]">{learner.speakingInsight.modeLabel}</p>
                </article>
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                    {pickLocale(locale, { zh: "考官判断", en: "Examiner signal" })}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.speakingInsight.examinerSignal}</p>
                  <p className="mt-2 text-sm text-[#435443]">{learner.speakingInsight.parentSummary}</p>
                </article>
              </div>
              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,255,255,0.78)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                    {pickLocale(locale, { zh: "教练下一步", en: "Coach next moves" })}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {learner.speakingInsight.coachFocus.map((move) => (
                      <li
                        key={move}
                        className="rounded-[18px] bg-[rgba(246,241,231,0.72)] px-4 py-3 text-sm font-medium text-[#314531]"
                      >
                        {move}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,250,244,0.82)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                    {pickLocale(locale, { zh: "家长摘要", en: "Parent readout" })}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#435443]">{learner.speakingInsight.parentSummary}</p>
                  <a
                    href="/practice/speaking"
                    className="mt-4 inline-flex rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea]"
                  >
                    {pickLocale(locale, { zh: "打开口语工作台", en: "Open speaking studio" })}
                  </a>
                </article>
              </div>
            </div>
          ) : (
            <article className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(246,241,231,0.72)] p-4">
              <p className="font-semibold text-[#1f2a1f]">
                {pickLocale(locale, { zh: "还没有口语信号", en: "No speaking signal yet" })}
              </p>
              <p className="mt-1 text-sm text-[#435443]">
                {pickLocale(locale, {
                  zh: "先跑一次口语工作台，启动从考官判断到教练建议的反馈闭环。",
                  en: "Run the speaking studio once to start the examiner-to-coach feedback loop."
                })}
              </p>
            </article>
          )
        },
        {
          title: pickLocale(locale, { zh: "切换学习者", en: "Switch learner" }),
          content: (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {previousLearner ? (
                  <a
                    href={`/admin/learner/${previousLearner.id}`}
                    className="inline-flex rounded-full border border-[rgba(35,64,43,0.12)] bg-[rgba(246,241,231,0.82)] px-4 py-2 text-sm font-semibold text-[#23402b]"
                  >
                    {locale === "zh" ? `上一位学习者：${previousLearner.name}` : `Previous learner: ${previousLearner.name}`}
                  </a>
                ) : null}
                {nextLearner ? (
                  <a
                    href={`/admin/learner/${nextLearner.id}`}
                    className="inline-flex rounded-full border border-[rgba(35,64,43,0.12)] bg-[rgba(246,241,231,0.82)] px-4 py-2 text-sm font-semibold text-[#23402b]"
                  >
                    {locale === "zh" ? `下一位学习者：${nextLearner.name}` : `Next learner: ${nextLearner.name}`}
                  </a>
                ) : null}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {learners.map((member) => {
                  const isCurrent = member.id === learner.id;

                  return (
                    <a
                      key={member.id}
                      href={`/admin/learner/${member.id}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`rounded-[22px] border p-4 transition ${
                        isCurrent
                          ? "border-[rgba(35,64,43,0.18)] bg-[rgba(35,64,43,0.92)] text-[#f7f3ea]"
                          : "border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.8)] text-[#1f2a1f] hover:bg-white"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-current/70">
                        {pickLocale(locale, { zh: "学习者", en: "Learner" })}
                      </p>
                      <p className="mt-2 text-base font-semibold">{member.name}</p>
                      <p className="mt-1 text-sm text-current/80">{`${member.referenceLevel} • ${member.internalBand}`}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "关联提醒", en: "Linked alerts" }),
          content: (
            <div className="space-y-3">
              {learnerAlerts.length > 0 ? (
                learnerAlerts.map((alert) => (
                  <article
                    key={`${learner.id}-${alert.title}`}
                    className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(246,241,231,0.72)] p-4"
                  >
                    <p className="font-semibold text-[#1f2a1f]">{alert.title}</p>
                    <p className="mt-1 text-sm text-[#435443]">{alert.detail}</p>
                  </article>
                ))
              ) : (
                <article className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="font-semibold text-[#1f2a1f]">
                    {pickLocale(locale, { zh: "当前没有提醒", en: "No active alerts" })}
                  </p>
                  <p className="mt-1 text-sm text-[#435443]">
                    {pickLocale(locale, {
                      zh: "先维持当前计划，继续观察下一次复盘周期。",
                      en: "Stay on the current plan and keep watching the next review cycle."
                    })}
                  </p>
                </article>
              )}
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "今日任务队列", en: "Today's queue" }),
          content: (
            <div className="space-y-3">
              {learner.dailyPlan.map((task) => (
                <article
                  key={task.title}
                  className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,255,255,0.78)] p-4"
                >
                  <p className="font-semibold text-[#1f2a1f]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#435443]">{task.detail}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "快捷操作", en: "Quick actions" }),
          content: (
            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/family"
                className="inline-flex rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea]"
              >
                {pickLocale(locale, { zh: "返回家庭总览", en: "Back to Family Overview" })}
              </a>
              <a
                href="/admin/system"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                {pickLocale(locale, { zh: "打开系统页", en: "Open System" })}
              </a>
              <a
                href="/practice"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                {pickLocale(locale, { zh: "打开练习中心", en: "Open practice hub" })}
              </a>
              <a
                href="/progress"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                {pickLocale(locale, { zh: "打开进度页", en: "Open progress" })}
              </a>
              <a
                href="/admin/alerts"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                {pickLocale(locale, { zh: "打开提醒看板", en: "Open alerts board" })}
              </a>
            </div>
          )
        }
      ]}
    />
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{value}</p>
    </article>
  );
}
