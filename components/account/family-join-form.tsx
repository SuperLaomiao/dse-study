"use client";

import { useActionState } from "react";

import { joinFamilyAction } from "@/app/actions/account";
import { pickLocale, type Locale } from "@/lib/i18n/config";
import { idleAccountActionState } from "@/lib/action-states";

export default function FamilyJoinForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(
    joinFamilyAction,
    idleAccountActionState
  );

  return (
    <form
      action={action}
      className="space-y-4 rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.88)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]"
    >
      <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          {pickLocale(locale, { zh: "学习者接入", en: "Learner handoff" })}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {pickLocale(locale, {
            zh: "使用将来负责学习计划的那个邮箱。邀请码会把这个学习者接到正确的家庭中，而不会重复创建第二个家庭。",
            en: "Use the email that should own the study plan. The invite code connects this learner to the correct family without creating a second household."
          })}
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "邮箱", en: "Email" })}
        </span>
        <input
          type="email"
          name="email"
          placeholder="brother@example.com"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "邀请码", en: "Invite code" })}
        </span>
        <input
          type="text"
          name="inviteCode"
          placeholder={locale === "zh" ? "例如：CHAN-FAMILY" : "CHAN-FAMILY"}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm uppercase text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
      >
        {pending
          ? pickLocale(locale, { zh: "加入中...", en: "Joining..." })
          : pickLocale(locale, { zh: "加入家庭", en: "Join Family" })}
      </button>
      <p className="text-xs leading-5 text-[var(--text-muted)]">
        {pickLocale(locale, {
          zh: "下一步：打开学习者档案，在测试日常学习循环前先设定每周容量。",
          en: "Next: open learner profile and set the weekly capacity before testing the daily loop."
        })}
      </p>
      {state.status !== "idle" ? (
        <p
          className={
            state.status === "error"
              ? "rounded-2xl bg-[rgba(196,90,64,0.08)] px-4 py-3 text-sm text-[#9f3a28]"
              : "rounded-2xl bg-[rgba(47,95,60,0.09)] px-4 py-3 text-sm text-[#2f5f3c]"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
