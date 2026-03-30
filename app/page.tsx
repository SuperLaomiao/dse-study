import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function LandingPage() {
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="public"
      title={pickLocale(locale, { zh: "DSE 学习", en: "DSE Study" })}
      description={pickLocale(locale, {
        zh: "面向家庭协作的英语学习产品，帮助孩子保持每日节奏、让家长更从容地跟进，并持续朝 DSE 成长。",
        en: "Family English learning built for daily momentum, calmer oversight, and long-term DSE growth."
      })}
      sections={[
        {
          title: pickLocale(locale, { zh: "为什么家庭能坚持下去", en: "Why families stay with it" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "每日节奏", en: "Daily momentum" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "短循环，不跑偏", en: "Short loops, no drift" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "练习和复盘都保持聚焦，进步才会积累。", en: "Practice and review stay narrow so progress compounds." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "家庭可见性", en: "Family visibility" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "家庭视图更清晰", en: "Clear household view" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "家长能一眼看懂当前重点、提醒和下一步决策。", en: "Parents can see focus, alerts, and next decisions at a glance." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "DSE 视角", en: "DSE framing" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "参考等级结合考试视角", en: "Reference level with exam lens" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "让每天的学习都继续指向更长期的 DSE 结果。", en: "Keep daily work anchored to longer-term DSE outcomes." })}</p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "下一步", en: "Next step" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "如果你想先感受产品，可以先看学习者预览；如果家庭空间已经准备好，就直接登录。",
                  en: "Start with the learner preview if you want to feel the product, or sign in directly if the family workspace is already set up."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  {pickLocale(locale, { zh: "打开登录页", en: "Open sign in" })}
                </a>
                <a
                  href="/home"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "预览学习者首页", en: "Preview learner home" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
