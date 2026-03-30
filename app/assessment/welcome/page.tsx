import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLearnerProfileByUserId } from "@/lib/repositories/profile-repository";
import fs from "fs";

export default async function AssessmentWelcomePage() {
  const session = await requireServerRole("learner");

  if (!session) {
    return null;
  }

  const profile = await getLearnerProfileByUserId(session.userId);
  const locale = await getRequestLocale();

  const en = JSON.parse(fs.readFileSync("i18n/en.json", "utf8"));
  const zh = JSON.parse(fs.readFileSync("i18n/zh.json", "utf8"));

  const t = (key: string) => {
    return pickLocale(locale, {
      zh: zh.assessment[key],
      en: en.assessment[key]
    });
  };

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
