import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function BaselineAssessmentPage() {
  const locale = await getRequestLocale();
  const sections = [
    pickLocale(locale, { zh: "词汇快照", en: "Vocabulary snapshot" }),
    pickLocale(locale, { zh: "阅读检查", en: "Reading check" }),
    pickLocale(locale, { zh: "听力捕捉", en: "Listening capture" }),
    pickLocale(locale, { zh: "口语信心", en: "Speaking confidence" }),
    pickLocale(locale, { zh: "写作结构", en: "Writing structure" })
  ];

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "基线评估", en: "Baseline Assessment" })}
      description={pickLocale(locale, {
        zh: "第一次诊断评估会通过清晰的模块组合，决定接下来两周的学习方向。",
        en: "The first diagnostic assessment guides the next two study weeks with a visible section mix."
      })}
      currentPath="/learn"
      sections={[
        {
          title: pickLocale(locale, { zh: "诊断组合", en: "Diagnostic mix" }),
          content: (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {sections.map((section) => (
                  <article
                    key={section}
                    className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4"
                  >
                    <p className="font-medium text-[#1f2a1f]">{section}</p>
                    <p className="mt-1 text-sm text-[#435443]">
                      {pickLocale(locale, {
                        zh: "先抓到足够清晰的信号，再决定最初两周该怎么排学习计划。",
                        en: "Capture just enough signal to shape the first two-week plan."
                      })}
                    </p>
                  </article>
                ))}
              </div>
              <a
                href="/practice"
                className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
              >
                {pickLocale(locale, { zh: "继续进入练习", en: "Continue to practice" })}
              </a>
            </div>
          )
        }
      ]}
    />
  );
}
