import SpeakingAiStudio from "@/components/practice/speaking-ai-studio";
import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function PracticeSpeakingPage() {
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "口语 AI 工作台", en: "Speaking AI Studio" })}
      description={pickLocale(locale, {
        zh: "上传一段短回答，立即获得考官式判断与教练式建议，让学习者和家长看到同一个下一步。",
        en: "Upload one short response and get examiner-style judgement plus coaching that helps the learner and the parent see the same next step."
      })}
      currentPath="/practice"
      sections={[
        {
          title: pickLocale(locale, { zh: "AI 反馈工作台", en: "AI feedback studio" }),
          content: <SpeakingAiStudio locale={locale} />
        },
        {
          title: pickLocale(locale, { zh: "为什么这套方式适合 DSE", en: "Why this works for DSE" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  {pickLocale(locale, { zh: "先抓模式", en: "Pattern first" })}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {pickLocale(locale, { zh: "先建立可复用表达框架", en: "Build reusable frames" })}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  {pickLocale(locale, {
                    zh: "先把常用句型练稳，再进入有压力的即时发挥，学习者会更不容易失速。",
                    en: "Learners stabilise common sentence shapes before being asked to improvise under pressure."
                  })}
                </p>
              </article>
              <article className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">
                  {pickLocale(locale, { zh: "模拟考试", en: "Exam simulation" })}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {pickLocale(locale, { zh: "真正回答题目本身", en: "Answer the actual question" })}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  {pickLocale(locale, {
                    zh: "考试模式看的是有没有真正回应题目，而不只是英文听起来够不够漂亮。",
                    en: "Exam mode judges whether the learner really responds, not just whether the English sounds polished."
                  })}
                </p>
              </article>
              <article className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">
                  {pickLocale(locale, { zh: "家长可见", en: "Parent visibility" })}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {pickLocale(locale, { zh: "一段白话摘要就够", en: "One plain-language summary" })}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  {pickLocale(locale, {
                    zh: "同一次练习会同步生成家长摘要，让家里的支持动作能对准学习者真正的薄弱点。",
                    en: "The same run produces a parent summary so support at home matches the learner’s real weak point."
                  })}
                </p>
              </article>
            </div>
          )
        }
      ]}
    />
  );
}
