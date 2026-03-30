import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function DseDashboardPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "DSE 看板", en: "DSE Dashboard" })}
      description={pickLocale(locale, {
        zh: "把每日参考等级学习翻译成 DSE 各卷压力与准备度的考试视角层。",
        en: "An exam-aware layer that translates daily reference-level work into paper-by-paper DSE pressure and readiness."
      })}
      currentPath="/progress"
      sections={[
        {
          title: pickLocale(locale, { zh: "考试视角", en: "Exam lens" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "卷别平衡", en: "Paper balance" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "Paper 1 仍决定上限", en: "Paper 1 still drives the ceiling" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "推断与时间控制会继续决定下一次分段跃升。", en: "Inference and timing will keep shaping the next band jump." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "信心锚点", en: "Confidence anchor" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "Paper 3 需要被保护", en: "Paper 3 stays protected" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "当阅读变难时，口语流利度不应该下滑。", en: "Speaking fluency should not drop while reading gets harder." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "当前区间", en: "Current bracket" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.internalBand}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "稳定性已经足够，可以继续向更高 DSE 分段推进。", en: "Enough stability to keep pushing toward a higher DSE band." })}</p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "就绪路径", en: "Readiness route" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "用 B1/B2 视图判断学习者现在是否适合扩大任务复杂度，还是应该再多守一轮可控冲刺。",
                  en: "Use the B1/B2 view to decide whether the learner is ready to widen task complexity or should keep one more controlled sprint."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/dse/b1-b2"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  {pickLocale(locale, { zh: "打开 B1/B2 就绪度", en: "Open B1/B2 readiness" })}
                </a>
                <a
                  href="/progress"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "返回进度页", en: "Back to progress" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
