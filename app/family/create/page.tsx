import AccountFlowStage from "@/components/account/account-flow-stage";
import FamilyCreateForm from "@/components/account/family-create-form";
import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function FamilyCreatePage() {
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="public"
      title={pickLocale(locale, { zh: "创建家庭", en: "Create Family" })}
      description={pickLocale(locale, {
        zh: "在一个页面里完成家庭空间创建、家长席位定义，并准备学习者加入流程。",
        en: "Start the family workspace, define the parent seat, and prepare the learner join flow in one place."
      })}
      sections={[
        {
          title: pickLocale(locale, { zh: "第 1 步（共 3 步）", en: "Step 1 of 3" }),
          content: (
            <AccountFlowStage
              step={pickLocale(locale, { zh: "第 1 步（共 3 步）", en: "Step 1 of 3" })}
              title={pickLocale(locale, { zh: "先创建家庭空间，再邀请其他成员。", en: "Create the family shell before inviting anyone else." })}
              description={pickLocale(locale, {
                zh: "这是管理员优先的第一步。先给家庭起一个容易识别的名字，确定家长席位，再把学习者交给加入流程，而不是创建平行账户。",
                en: "This is the admin-first step. Give the household a recognizable name, anchor the parent seat, then hand the learner off to the join route instead of creating parallel accounts."
              })}
              actions={
                <>
                  <a
                    href="/family/join"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {pickLocale(locale, { zh: "下一步去学习者加入", en: "Go to learner join next" })}
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
          title: pickLocale(locale, { zh: "会创建什么", en: "What gets created" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{pickLocale(locale, { zh: "家长控制席位", en: "Parent control seat" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "管理员从这里开始", en: "Admin starts here" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "这个名字会锚定提醒、家庭总览和后续邀请。", en: "This name anchors alerts, family overview, and future invites." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">{pickLocale(locale, { zh: "共享家庭空间", en: "Shared family space" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "一个家庭视图", en: "One household view" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "学习者、队列、提醒和复盘节奏都会收在同一个家庭标签下。", en: "Learners, queues, alerts, and review rhythm live under one family label." })}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">{pickLocale(locale, { zh: "邀请路径", en: "Invite route" })}</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{pickLocale(locale, { zh: "准备好加入码", en: "Ready for join codes" })}</p>
                <p className="mt-1 text-sm text-[#435443]">{pickLocale(locale, { zh: "下一步走加入流程，让学习者干净地进入同一个空间。", en: "Use the join flow next so the learner enters the same workspace cleanly." })}</p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "设置表单", en: "Setup form" }),
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                {pickLocale(locale, {
                  zh: "家庭名称尽量简单、好认。家长名称会显示在管理员看板上。",
                  en: "Keep the family name simple and recognizable. The parent name is what appears on the admin dashboard."
                })}
              </p>
              <FamilyCreateForm locale={locale} />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "下一步", en: "Next step" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                If the family has already been created, jump straight into the learner join route instead of creating a second household.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/family/join"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  {pickLocale(locale, { zh: "已经有邀请码？", en: "Already have an invite?" })}
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
