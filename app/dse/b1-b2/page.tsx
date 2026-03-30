import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function B1B2ReadinessPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "B1/B2 就绪度", en: "B1/B2 Readiness" })}
      description={pickLocale(locale, {
        zh: "一个更聚焦的就绪度面板，用来判断学习者能否承受更难的 DSE 风格任务而不失控。",
        en: "A narrow readiness board for deciding whether the learner can tolerate tougher DSE-style demands without losing control."
      })}
      currentPath="/progress"
      sections={[
        {
          title: pickLocale(locale, { zh: "就绪状态", en: "Readiness status" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "限时阅读", en: "Reading under time" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "快准备好了", en: "Nearly ready" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "推断质量已经够了，但计时仍会把节奏拉散。", en: "Inference quality is there; the clock still creates drift." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "词汇底盘", en: "Vocabulary floor" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "稳定", en: "Stable" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "复习循环已经足够稳，可以支撑下一轮更难的任务。", en: "Review loops are strong enough to support a harder next cycle." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "口语外溢风险", en: "Speaking spillover" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "要密切观察", en: "Watch closely" })}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, {
                    zh: `${learner.name} 这一周里仍然需要刻意安排几次轻量成功体验。`,
                    en: `${learner.name} still needs easy wins built into the week.`
                  })}
                </p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "建议", en: "Recommendation" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "把阅读压力小幅往上提，词汇复习维持原位，同时避免把高强度阅读和口语放在同一天叠加。",
                  en: "Increase reading pressure slightly, keep vocabulary revision exactly where it is, and avoid stacking hard reading and speaking on the same day."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/dse"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  {pickLocale(locale, { zh: "打开 DSE 看板", en: "Open DSE dashboard" })}
                </a>
                <a
                  href="/practice/reading"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "打开阅读模块", en: "Open reading module" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
