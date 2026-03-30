import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { t as translate } from "@/lib/i18n/client";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLearnerProfileByUserId } from "@/lib/repositories/profile-repository";

export default async function AssessmentWelcomePage() {
  const session = await requireServerRole("learner");

  if (!session) {
    return null;
  }

  const profile = await getLearnerProfileByUserId(session.userId);
  const locale = await getRequestLocale();

  const t = (key: string) => translate(locale, `assessment.${key}`);

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={t("welcomeTitle")}
      description={t("welcomeDescription")}
      currentPath="/assessment/welcome"
      sections={[
        {
          title: pickLocale(locale, { zh: "评估信息", en: "Assessment Information" }),
          content: (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-5">
                <p className="text-sm leading-7 text-[#435443]">
                  {t("assessmentInfo")}
                </p>
                <div className="mt-4">
                  <p className="text-sm leading-7 text-[#435443]">
                    {t("whatNext")}
                  </p>
                </div>
                {profile?.profileName ? (
                  <div className="mt-4 rounded-[20px] bg-white/70 px-4 py-3 text-sm leading-6 text-[#435443]">
                    {pickLocale(locale, {
                      zh: `本次结果会写入 ${profile.profileName} 的学习档案，并影响接下来两周的起始难度。`,
                      en: `This result will be saved to ${profile.profileName}'s learning profile and shape the starting difficulty for the next two weeks.`
                    })}
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center pt-2">
                <a
                  href="/assessment/take"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                >
                  {t("startButton")}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
