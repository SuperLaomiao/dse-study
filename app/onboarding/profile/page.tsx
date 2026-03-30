import AccountFlowStage from "@/components/account/account-flow-stage";
import OnboardingProfileForm from "@/components/account/onboarding-profile-form";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLearnerProfileByUserId } from "@/lib/repositories/profile-repository";

export default async function OnboardingProfilePage() {
  const session = await requireServerRole("learner");

  if (!session) {
    return null;
  }

  const profile = await getLearnerProfileByUserId(session.userId);
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="learner"
      title={pickLocale(locale, { zh: "学习者档案", en: "Learner Profile" })}
      description={pickLocale(locale, {
        zh: "先锁定学习者身份、每日容量和目标分段，让学习循环保持聚焦且可信。",
        en: "Lock in the learner identity, daily capacity, and target band so the study loop can stay narrow and believable."
      })}
      currentPath="/learn"
      sections={[
        {
          title: pickLocale(locale, { zh: "第 3 步（共 3 步）", en: "Step 3 of 3" }),
          content: (
            <AccountFlowStage
              step={pickLocale(locale, { zh: "第 3 步（共 3 步）", en: "Step 3 of 3" })}
              title={pickLocale(locale, { zh: "把学习者转成一个可信的每周学习节奏。", en: "Translate the learner into a believable weekly study shape." })}
              description={pickLocale(locale, {
                zh: "这是日常学习循环接管前的最后一次交接。先锁定容量、目标方向和轨道，让学习者首页、练习队列与管理员预期保持一致。",
                en: "This is the final handoff before the daily loop takes over. Lock in capacity, target direction, and track so the learner home, practice queue, and admin expectations all stay aligned."
              })}
              actions={
                <>
                  <a
                    href="/learn"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {pickLocale(locale, { zh: "继续进入学习", en: "Continue into learn" })}
                  </a>
                  <a
                    href="/sign-in"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "打开登录页", en: "Open sign-in" })}
                  </a>
                </>
              }
            />
          )
        },
        {
          title: pickLocale(locale, { zh: "档案设置", en: "Profile settings" }),
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "这个表单会决定应用如何校准任务难度、复盘压力，以及管理员看板该如何理解这个学习者。",
                  en: "This form controls how the app calibrates task difficulty, review pressure, and what the admin dashboard should expect from the learner."
                })}
              </p>
              <OnboardingProfileForm profile={profile} locale={locale} />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "为什么这份档案很重要", en: "Why this profile matters" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "每日容量", en: "Daily capacity" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "贴近真实一周", en: "Match the real week" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "每日分钟数和每周学习天数，会决定每个队列该有多重。", en: "Minutes and study days decide how hard each queue should feel." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "目标方向", en: "Target direction" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "参考等级加分段", en: "Reference plus band" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "这两个目标会让学习者和家长看向同一个北极星。", en: "Both targets keep the learner and parent seeing the same north star." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "轨道框架", en: "Track framing" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "DSE 感知的排队逻辑", en: "DSE-aware queueing" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "所选轨道会决定系统更偏向考试优先，还是基础优先。", en: "The selected track determines whether the system leans exam-first or foundation-first." })}</p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "完成交接", en: "Finish the handoff" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "确认档案设置无误后，回到学习页，让每日循环继承更新后的容量与目标。",
                  en: "Once the profile looks right, go back to learn and let the daily loop inherit the updated capacity and targets."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(!profile || !profile.targetReferenceLevel) ? (
                  <a
                    href="/assessment/welcome"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    {pickLocale(locale, { zh: "开始基线评估", en: "Start baseline assessment" })}
                  </a>
                ) : (
                  <a
                    href="/learn"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    {pickLocale(locale, { zh: "返回学习页", en: "Back to learn" })}
                  </a>
                )}
                <a
                  href="/progress"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "打开进度页", en: "Open progress" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
