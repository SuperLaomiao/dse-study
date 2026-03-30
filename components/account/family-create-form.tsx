"use client";

import { useActionState } from "react";

import { createFamilyAction } from "@/app/actions/account";
import { pickLocale, type Locale } from "@/lib/i18n/config";
import { idleAccountActionState } from "@/lib/action-states";

export default function FamilyCreateForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(
    createFamilyAction,
    idleAccountActionState
  );

  return (
    <form
      action={action}
      className="space-y-4 rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.88)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]"
    >
      <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          {pickLocale(locale, { zh: "管理员优先设置", en: "Admin-first setup" })}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {pickLocale(locale, {
            zh: "使用学习者一眼能认出的家庭名称。家长姓名会成为家庭总览与提醒页里的管理员标签。",
            en: "Use the household name the learner will recognize. The parent name becomes the admin label on family overview and alerts."
          })}
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "家庭名称", en: "Family name" })}
        </span>
        <input
          type="text"
          name="familyName"
          placeholder={locale === "zh" ? "例如：陈家" : "Chan Family"}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "家长名称", en: "Parent name" })}
        </span>
        <input
          type="text"
          name="parentName"
          placeholder={locale === "zh" ? "例如：妈妈管理员" : "Mom Admin"}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "邮箱", en: "Email" })}
        </span>
        <input
          type="email"
          name="email"
          placeholder="mom@example.com"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "密码", en: "Password" })}
        </span>
        <input
          type="password"
          name="password"
          placeholder={locale === "zh" ? "请设置密码" : "Create a password"}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
      >
        {pending
          ? pickLocale(locale, { zh: "保存中...", en: "Saving..." })
          : pickLocale(locale, { zh: "创建家庭", en: "Create Family" })}
      </button>
      <p className="text-xs leading-5 text-[var(--text-muted)]">
        {pickLocale(locale, {
          zh: "下一步：把学习者带到加入家庭页面，这样两个人都会进入同一个共享家庭空间。",
          en: "Next: send the learner to the join route so both people land in one shared family space."
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
