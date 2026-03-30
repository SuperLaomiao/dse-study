import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ProgressPage() {
  const locale = await getRequestLocale();
  const learner = getDefaultLearner(locale);
  const speakingInsight = learner.speakingInsight;

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "进度", en: "Progress" })}
      description={pickLocale(locale, {
        zh: "看得见的成长很重要。这个页面让参考等级与趋势卡片更可信。",
        en: "Visible growth matters. This page keeps Reference Level and trend cards trustworthy."
      })}
      currentPath="/progress"
      sections={[
        {
          title: pickLocale(locale, { zh: "参考等级轨迹", en: "Reference level arc" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "当前", en: "Current" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {locale === "zh" ? `${learner.referenceLevel} 当前` : `${learner.referenceLevel} now`}
                </p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "当前任务所对应的参考等级。", en: "Reference level for current tasks." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "工作分段", en: "Working band" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {locale === "zh" ? `${learner.internalBand} 工作分段` : `${learner.internalBand} working band`}
                </p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "用于调节下一轮循环的难度。", en: "Used to tune the next cycle difficulty." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "趋势", en: "Trend" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "稳定向上", en: "Stable upward rhythm" })}</p>
                <p className="mt-1 text-sm text-[#435443]">
                  {pickLocale(locale, { zh: "稳定性已经足够，让下一轮把一个薄弱点再压得更紧。", en: "Consistency is good enough to push one area harder next cycle." })}
                </p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "最新口语 AI 信号", en: "Latest speaking AI signal" }),
          content: speakingInsight ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1.05fr_1.2fr]">
                <article className="rounded-[24px] bg-[rgba(227,240,231,0.9)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "最近一次训练", en: "Most recent drill" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{speakingInsight.taskLabel}</p>
                  <p className="mt-1 text-sm text-[#435443]">{speakingInsight.modeLabel}</p>
                </article>
                <article className="rounded-[24px] bg-[rgba(255,250,244,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "考官信号", en: "Examiner signal" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{speakingInsight.examinerSignal}</p>
                  <p className="mt-2 text-sm text-[#435443]">{speakingInsight.parentSummary}</p>
                </article>
              </div>
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "教练下一步建议", en: "Coach next moves" })}</p>
                <ul className="mt-3 grid gap-3 md:grid-cols-2">
                  {speakingInsight.coachFocus.map((move) => (
                    <li
                      key={move}
                      className="rounded-[20px] bg-white/72 px-4 py-3 text-sm font-medium text-[#314531]"
                    >
                      {move}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/practice/speaking"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    {pickLocale(locale, { zh: "打开口语工作台", en: "Open speaking studio" })}
                  </a>
                  <a
                    href="/review/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "对照复盘结果", en: "Compare with review result" })}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#435443]">{pickLocale(locale, { zh: "完成第一次口语工作台练习后，这里会显示口语 AI 反馈。", en: "Speaking AI feedback will appear after the first speaking studio run." })}</p>
          )
        },
        {
          title: pickLocale(locale, { zh: "检查点面板", en: "Checkpoint board" }),
          content: (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "评估", en: "Assessment" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "诊断已完成", en: "Diagnostic complete" })}</p>
                  <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "这轮循环的参考等级与分段信号已经校准。", en: "Reference and band signals are calibrated for this cycle." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "冲刺复盘", en: "Sprint review" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "等待重置", en: "Reset pending" })}</p>
                  <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "下一次复盘要继续把难度压得窄而锋利。", en: "Use the next review to keep difficulty narrow and sharp." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "信心观察", en: "Confidence watch" })}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "口语需要保护", en: "Speaking needs protection" })}</p>
                  <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "不要让更难的阅读压力外溢成口语疲劳。", en: "Do not let harder reading spill into speaking fatigue." })}</p>
              </div>
              </div>
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                  {pickLocale(locale, {
                    zh: "让评估循环持续可见，这样每个练习块都能回接到一个检查点和清晰的下一步决策。",
                    en: "Keep the assessment loop visible so every practice block maps back to a checkpoint and a next-step decision."
                  })}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/assessment/baseline"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    {pickLocale(locale, { zh: "打开基线评估", en: "Open baseline assessment" })}
                  </a>
                  <a
                    href="/assessment/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "查看评估结果", en: "View assessment result" })}
                  </a>
                  <a
                    href="/review/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "查看复盘结果", en: "View review result" })}
                  </a>
                  <a
                    href="/review/biweekly"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "查看双周复盘", en: "See bi-weekly review" })}
                  </a>
                </div>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
