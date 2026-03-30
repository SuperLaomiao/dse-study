import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function BiweeklyReviewPage() {
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "双周复盘", en: "Bi-weekly Review" })}
      description={pickLocale(locale, {
        zh: "长期学习重置与复盘检查点，现在会落成更具体的决策。",
        en: "Long-term learning resets and review checkpoints now land as concrete decisions."
      })}
      currentPath="/learn"
      sections={[
        {
          title: pickLocale(locale, { zh: "重设决策", en: "Reset decisions" }),
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="grid gap-3 md:grid-cols-3">
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "保留", en: "Keep" })}</p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    {pickLocale(locale, { zh: "保留词汇循环，继续当作热身锚点。", en: "Vocabulary loop as the warm-up anchor." })}
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "收紧", en: "Tighten" })}</p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    {pickLocale(locale, { zh: "推断题要缩成更短、带计时的小题组。", en: "Inference tasks need shorter, timed sets." })}
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                    {pickLocale(locale, { zh: "降低摩擦", en: "Drop friction" })}
                  </p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    {pickLocale(locale, { zh: "如果这一周起伏较大，就把复盘日安排得更轻一点。", en: "Make review days lighter if the week was uneven." })}
                  </p>
                </article>
              </div>
              <aside className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-white/82 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  {pickLocale(locale, { zh: "复盘记分板", en: "Review scoreboard" })}
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[#435443]">
                  <p>
                    {locale === "zh" ? (
                      <>
                        工作循环在过去 <span className="font-semibold text-[#1f2a1f]">12 天里守住了 9 天</span>。
                      </>
                    ) : (
                      <>
                        Working loop held for <span className="font-semibold text-[#1f2a1f]">9 of the last 12 days</span>.
                      </>
                    )}
                  </p>
                  <p>
                    {pickLocale(locale, {
                      zh: "整体信心仍是正向的，但计时推断依然是决定性的缺口。",
                      en: "Confidence stayed positive, but timed inference remains the deciding gap."
                    })}
                  </p>
                  <p>
                    {pickLocale(locale, {
                      zh: "在提高每周负荷之前，先让计划再窄一轮周期。",
                      en: "Keep the plan narrow for one more cycle before raising the weekly load."
                    })}
                  </p>
                </div>
              </aside>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "下一步路线", en: "Next route" }),
          content: (
            <div className="flex flex-wrap gap-3">
              <a
                href="/progress"
                className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
              >
                {pickLocale(locale, { zh: "打开进度页", en: "Open progress" })}
              </a>
              <a
                href="/review/result"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.14)] bg-[rgba(246,241,231,0.78)] px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-[rgba(246,241,231,0.95)]"
              >
                {pickLocale(locale, { zh: "打开复盘结果", en: "Open review result" })}
              </a>
              <a
                href="/practice"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.14)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
              >
                {pickLocale(locale, { zh: "返回练习中心", en: "Return to practice" })}
              </a>
            </div>
          )
        }
      ]}
    />
  );
}
