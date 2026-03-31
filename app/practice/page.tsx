import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

const practiceLinksZh = {
  "词汇循环": "/vocabulary/practice",
  "阅读": "/reading",
  "听力": "/listening",
  "口语短语循环": "/speaking/practice",
  "写作": "/practice/writing"
} as const;

const practiceLinksEn = {
  "Vocabulary Loop": "/vocabulary/practice",
  "Reading": "/reading",
  "Listening": "/listening",
  "Speaking Phrase Loop": "/speaking/practice",
  "Writing": "/practice/writing"
} as const;

const practiceLabels = {
  "词汇循环": "vocabulary",
  "词汇循环en": "vocabulary",
  "阅读": "reading",
  "阅读en": "reading",
  "听力": "listening",
  "听力en": "listening",
  "口语短语循环": "speaking",
  "口语短语循环en": "speaking",
  "写作": "writing",
  "Vocabulary Loop": "vocabulary",
  "Reading": "reading",
  "Listening": "listening",
  "Speaking Phrase Loop": "speaking",
  "Writing": "writing"
} as const;

export default async function PracticeHubPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);
  const recommendedTask = learner.dailyPlan[0];
  const practiceLinks = locale === "zh" ? practiceLinksZh : practiceLinksEn;

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "练习", en: "Practice" })}
      description={pickLocale(locale, {
        zh: "选择一个聚焦模块，或继续当前推荐练习。",
        en: "Choose a focused module or continue the current recommended session."
      })}
      currentPath="/practice"
      sections={[
        {
          title: pickLocale(locale, { zh: "推荐下一步", en: "Recommended next move" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#23402b_0%,#4d6842_62%,#738b65_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(255,250,243,0.72)]">
                {pickLocale(locale, { zh: "从今日队列继续", en: "Continue from today's queue" })}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                {recommendedTask?.title ?? (locale === "zh" ? "词汇循环" : "Vocabulary Loop"}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(255,250,243,0.84)]">
                {recommendedTask?.detail ??
                  pickLocale(locale, {
                    zh: "把练习控制在一个窄而稳的循环里，这样下次复盘才能看到真实提升。",
                    en: "Stay inside one narrow practice loop so the next review can measure real lift."
                  })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={recommendedTask ? practiceLinks[recommendedTask.title as keyof typeof practiceLinks] ?? "/vocabulary/practice"}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(255,250,243,0.62)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[#183321] shadow-[0_14px_28px_rgba(18,34,22,0.24)] transition hover:-translate-y-[1px] hover:bg-white"
                >
                  {pickLocale(locale, { zh: "开始推荐模块", en: "Start recommended block" })}
                </a>
                <a
                  href="/review/biweekly"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(255,250,243,0.42)] bg-[rgba(255,250,243,0.18)] px-5 py-3 text-sm font-semibold text-[#fff8ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:-translate-y-[1px] hover:bg-[rgba(255,250,243,0.28)]"
                >
                  {pickLocale(locale, { zh: "查看复盘节奏", en: "See review rhythm" })}
                </a>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "练习模块", en: "Modules" }),
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {learner.dailyPlan.map((task) => (
                <article
                  key={task.title}
                  className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "今天", en: "Today" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{task.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{task.detail}</p>
                  <a
                    href={practiceLinks[task.title as keyof typeof practiceLinks] ?? "/practice"}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--brand)] shadow-[0_10px_24px_rgba(31,42,31,0.08)] transition hover:bg-white"
                  >
                    {locale === "zh"
                      ? `打开${practiceLabels[task.title as keyof typeof practiceLabels] ?? "practice"}模块`
                      : `Open ${practiceLabels[task.title as keyof typeof practiceLabels] ?? "practice"} module`}
                  </a>
                </article>
              ))}

              {Object.entries(practiceLinks)
                .filter(([title]) => !learner.dailyPlan.some((task) => task.title === title))
                .map(([title, href]) => (
                  <article
                    key={title}
                    className="rounded-[24px] border border-dashed border-[rgba(35,64,43,0.14)] bg-[rgba(255,255,255,0.82)] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "探索", en: "Explore" })}</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      {pickLocale(locale, { zh: "当你想轮换练习组合时，这个模块会保持可用。", en: "Keep this module available when you want to rotate the practice mix." })}
                    </p>
                    <a
                      href={href}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                    >
                      {locale === "zh"
                        ? `打开${practiceLabels[title as keyof typeof practiceLabels] ?? "practice"}模块`
                        : `Open ${practiceLabels[title as keyof typeof practiceLabels] ?? "practice"} module`}
                    </a>
                  </article>
                ))}
            </div>
          )
        }
      ]}
    />
  );
}
