import PlaceholderPage from "@/components/placeholder-page";
import type { Locale } from "@/lib/i18n/config";

interface PracticeModulePageProps {
  locale: Locale;
  title: string;
  description: string;
  leadLabel: string;
  leadValue: string;
  leadDetail: string;
  boardCards?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  checkpoints: string[];
  primaryLink: { href: string; label: string };
  secondaryLink: { href: string; label: string };
}

export default function PracticeModulePage({
  locale,
  title,
  description,
  leadLabel,
  leadValue,
  leadDetail,
  boardCards = [],
  checkpoints,
  primaryLink,
  secondaryLink
}: PracticeModulePageProps) {
  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={title}
      description={description}
      currentPath="/practice"
      sections={[
        {
          title: leadLabel,
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(76,110,67,0.9))] p-5 text-[#f8f5ed]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(248,245,237,0.72)]">
                {locale === "zh" ? "当前模块焦点" : "Active module focus"}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{leadValue}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.82)]">
                {leadDetail}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={primaryLink.href}
                  className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                >
                  {primaryLink.label}
                </a>
                <a
                  href={secondaryLink.href}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.24)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                >
                  {secondaryLink.label}
                </a>
              </div>
            </div>
          )
        },
        {
          title: locale === "zh" ? "训练面板" : "Session board",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              {boardCards.length > 0 ? (
                boardCards.map((card) => (
                  <article
                    key={`${card.label}-${card.value}`}
                    className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{card.label}</p>
                    <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{card.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[#435443]">{card.detail}</p>
                  </article>
                ))
              ) : (
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4 md:col-span-3">
                  <p className="text-sm leading-6 text-[#435443]">
                    {locale === "zh"
                      ? "等训练能力接通后，这个模块会在这里显示当前面板卡片。"
                      : "This module will surface its active board cards once the training slice is wired through."}
                  </p>
                </article>
              )}
            </div>
          )
        },
        {
          title: locale === "zh" ? "检查清单" : "Checkpoint stack",
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {checkpoints.map((item) => (
                <article
                  key={item}
                  className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4"
                >
                  <p className="text-sm font-medium leading-6 text-[#314531]">{item}</p>
                </article>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
