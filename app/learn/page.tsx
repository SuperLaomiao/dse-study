import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function LearnPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "学习", en: "Learn" })}
      description={pickLocale(locale, {
        zh: "每日计划的生成与完成，现在从一个更清晰的学习循环开始。",
        en: "Daily plan generation and completion flow now starts from a clearer learning loop."
      })}
      currentPath="/learn"
      sections={[
        {
          title: pickLocale(locale, { zh: "今日学习循环", en: "Today’s learning loop" }),
          content: (
            <div className="overflow-hidden rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#24432d_0%,#4d6842_62%,#6e845f_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(255,250,243,0.74)]">
                {pickLocale(locale, { zh: "顺序", en: "Sequence" })}
              </p>
              <p className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.03em] md:text-[2.15rem]">
                {pickLocale(locale, { zh: "先热身，再练习，最后复盘最准确的薄弱点。", en: "Warm up, practice, then review the exact weak point." })}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(255,250,243,0.84)] md:text-[15px]">
                {pickLocale(locale, {
                  zh: `${learner.name} 正在沿着一条收窄后的学习循环推进，让每次练习都能叠加效果，而不是把注意力打散。`,
                  en: `${learner.name} is working through a narrow cycle so every session compounds instead of scattering attention.`
                })}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/practice"
                  className="inline-flex min-w-[168px] items-center justify-center rounded-full bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand-strong)] shadow-[0_14px_28px_rgba(18,34,22,0.18)] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "打开练习中心", en: "Open practice hub" })}
                </a>
                <a
                  href="/progress"
                  className="inline-flex min-w-[168px] items-center justify-center rounded-full border border-[rgba(255,250,243,0.28)] bg-[rgba(255,250,243,0.1)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,250,243,0.18)]"
                >
                  {pickLocale(locale, { zh: "查看进度", en: "Review progress" })}
                </a>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "决策面板", en: "Decision board" }),
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="rounded-[26px] border border-[rgba(114,95,63,0.08)] bg-[linear-gradient(180deg,rgba(248,244,236,0.92),rgba(243,237,226,0.82))] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "今日判断", en: "Today’s call" })}</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)] md:text-[1.45rem]">
                  {pickLocale(locale, {
                    zh: "先维持范围收窄，保护推进势能，再考虑加入任何新内容。",
                    en: "Stay narrow and protect momentum before adding anything new."
                  })}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)] md:text-[15px]">
                  {pickLocale(locale, {
                    zh: "这一轮里，一次聚焦练习加一个复盘触点就已经足够。",
                    en: "One focused practice block plus one review touchpoint is enough for this cycle."
                  })}
                </p>
              </div>
              <div className="rounded-[26px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.92)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "下一步", en: "Next step" })}</p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-muted)] md:text-[15px]">
                  <p>{pickLocale(locale, { zh: "1. 趁目标技能还新鲜时，先完成练习。", en: "1. Run practice while the target skill is fresh." })}</p>
                  <p>{pickLocale(locale, { zh: "2. 练习块结束后，再回头检查进度。", en: "2. Check progress once the block is complete." })}</p>
                  <p>{pickLocale(locale, { zh: "3. 到双周复盘时，再决定这一轮是继续收紧还是重设。", en: "3. Use the bi-weekly review to decide whether the loop should tighten or reset." })}</p>
                </div>
                <a
                  href="/review/biweekly"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                >
                  {pickLocale(locale, { zh: "打开双周复盘", en: "Open bi-weekly review" })}
                </a>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "理由堆栈", en: "Reason stack" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "为什么先做这个", en: "Why this first" })}</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">{pickLocale(locale, { zh: "推断能力还需要更多重复。", en: "Inference still needs repetition." })}</p>
              </article>
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "要保护什么", en: "What to protect" })}</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">{pickLocale(locale, { zh: "口语信心不能往下掉。", en: "Speaking confidence should not dip." })}</p>
              </article>
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "复盘抓手", en: "Review edge" })}</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">{pickLocale(locale, { zh: "让循环稳定到足以支撑复盘日。", en: "Keep the loop stable enough for review day." })}</p>
              </article>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "水平评估", en: "Level Assessment" }),
          content: (
            <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-5">
              <p className="text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "重新进行基线水平测试，更新你的预估等级，帮助系统更好地调整学习内容。",
                  en: "Retake the baseline assessment to update your estimated level and help the system better adjust your learning content."
                })}
              </p>
              <div className="mt-4">
                <a
                  href="/assessment/welcome"
                  className="inline-flex items-center justify-center rounded-full bg-[#8b6147] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[#725039]"
                >
                  {pickLocale(locale, { zh: "重新评估", en: "Retake Assessment" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
