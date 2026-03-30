import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ReviewResultPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "复盘结果", en: "Review Result" })}
      description={pickLocale(locale, {
        zh: "两周冲刺后的紧凑决策读数，让学习者知道什么保留、什么收紧、下一步改什么。",
        en: "A compact decision readout after the two-week sprint so the learner knows what stays, what tightens, and what changes next."
      })}
      currentPath="/progress"
      sections={[
        {
          title: pickLocale(locale, { zh: "周期结论", en: "Cycle verdict" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "保留", en: "Keep" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "词汇循环", en: "Vocabulary loops" })}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, {
                    zh: "回忆训练正在保护流畅度与信心。",
                    en: "Recall drills are protecting fluency and confidence."
                  })}
                </p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "收紧", en: "Tighten" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "推断题计时", en: "Inference timing" })}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, {
                    zh: "加快阅读时钟，但不要同时把题材范围放大。",
                    en: "Push the reading clock without widening topic scope."
                  })}
                </p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "观察", en: "Watch" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "口语信心", en: "Speaking confidence" })}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {locale === "zh" ? `${learner.name} 仍然需要更频繁的小成功体验。` : `${learner.name} still needs frequent easy wins.`}
                </p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "下一轮冲刺重设", en: "Reset for next sprint" }),
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                  {pickLocale(locale, {
                    zh: "继续维持每周六天学习，把最难的任务提前到一天前段，并把同样的复盘节奏带进下一轮两周周期。",
                    en: "Keep six study days, move the hardest task earlier in the day, and carry the same review cadence into the next fortnight."
                  })}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/learn"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    {pickLocale(locale, { zh: "返回学习页", en: "Return to learn" })}
                  </a>
                  <a
                    href="/progress"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "再次查看进度", en: "Review progress again" })}
                  </a>
                  <a
                    href="/practice"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "打开练习中心", en: "Open practice" })}
                  </a>
                </div>
              </div>
              <aside className="rounded-[24px] bg-[rgba(255,255,255,0.82)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  {pickLocale(locale, { zh: "下一轮检查清单", en: "Next sprint checklist" })}
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[#435443]">
                  <p>{pickLocale(locale, { zh: "1. 保持同一个热身锚点。", en: "1. Keep the same warm-up anchor." })}</p>
                  <p>{pickLocale(locale, { zh: "2. 把计时推断放到第一个高强度时段。", en: "2. Move timed inference to the first hard block." })}</p>
                  <p>{pickLocale(locale, { zh: "3. 每个周期都保留一次轻量口语成功体验。", en: "3. Protect one light speaking win every cycle." })}</p>
                </div>
              </aside>
            </div>
          )
        }
      ]}
    />
  );
}
