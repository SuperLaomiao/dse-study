import AccountFlowStage from "@/components/account/account-flow-stage";
import FamilyJoinForm from "@/components/account/family-join-form";
import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function FamilyJoinPage() {
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="public"
      title={pickLocale(locale, { zh: "加入家庭", en: "Join Family" })}
      description={pickLocale(locale, {
        zh: "使用学习者邮箱和邀请码接入家庭空间，不再重复创建账户流程。",
        en: "Use the learner email and invite code to attach into the family space without creating a duplicate account flow."
      })}
      sections={[
        {
          title: pickLocale(locale, { zh: "第 2 步（共 3 步）", en: "Step 2 of 3" }),
          content: (
            <AccountFlowStage
              step={pickLocale(locale, { zh: "第 2 步（共 3 步）", en: "Step 2 of 3" })}
              title={pickLocale(locale, { zh: "用一个稳定身份把学习者接入现有家庭。", en: "Attach the learner to the existing family with one stable identity." })}
              description={pickLocale(locale, {
                zh: "这一步应该像一次干净的交接，而不是第二条 onboarding 分支。使用未来要承接学习计划的那个邮箱，只加入一次家庭，然后直接进入学习者档案校准。",
                en: "This step should feel like a clean handoff, not a second onboarding fork. Use the learner email that should own the study plan, join the household once, then move straight to learner profile calibration."
              })}
              actions={
                <>
                  <a
                    href="/onboarding/profile"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {pickLocale(locale, { zh: "继续到学习者档案", en: "Continue to learner profile" })}
                  </a>
                  <a
                    href="/sign-in"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "返回登录", en: "Back to sign-in" })}
                  </a>
                </>
              }
            />
          )
        },
        {
          title: pickLocale(locale, { zh: "你需要准备什么", en: "What you need" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "学习者邮箱", en: "Learner email" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "保持身份稳定", en: "Keep identity stable" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "未来的学习者档案和登录都会通过它映射到正确的孩子。", en: "This is how the learner profile and future login map to the right child." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "邀请码", en: "Invite code" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "家庭握手", en: "Family handshake" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "用管理员提供的邀请码，让学习者落到正确的家庭里。", en: "Use the admin-provided code so the learner lands in the correct household." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "演示邀请码", en: "Demo invite" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">CHAN-FAMILY</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "你可以用预置的演示码快速体验 MVP 流程。", en: "You can use the seeded demo code to explore the MVP flow quickly." })}</p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "加入表单", en: "Join form" }),
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "先填写未来要承接学习计划的学习者邮箱。如果你只是体验产品，可以使用演示邀请码。",
                  en: "Start with the learner email that should own the study plan. If you are just exploring, use the demo join code."
                })}
              </p>
              <FamilyJoinForm locale={locale} />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "还没有家庭空间？", en: "Need a household first" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "如果家庭空间还没建立，请先回去创建家长工作区，再用学习者账号加入。",
                  en: "If no family has been created yet, go back and create the parent workspace before trying to join with a learner account."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/family/create"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  {pickLocale(locale, { zh: "要先创建家庭吗？", en: "Need to create the family first?" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
