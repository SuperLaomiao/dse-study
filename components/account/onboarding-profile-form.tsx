"use client";

import { useActionState } from "react";

import { saveLearnerProfileAction } from "@/app/actions/profile";
import { pickLocale, type Locale } from "@/lib/i18n/config";
import { idleProfileActionState } from "@/lib/action-states";
import type { LearnerProfileRecord } from "@/lib/types";

export default function OnboardingProfileForm({
  profile,
  locale
}: {
  profile: LearnerProfileRecord | null;
  locale: Locale;
}) {
  const [state, action, pending] = useActionState(
    saveLearnerProfileAction,
    idleProfileActionState
  );

  return (
    <form
      action={action}
      className="space-y-4 rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.88)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)] md:grid md:grid-cols-2 md:gap-4 md:space-y-0"
    >
      <div className="rounded-[20px] bg-[var(--surface-soft)] p-4 md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          {pickLocale(locale, { zh: "校准设置", en: "Calibration" })}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {pickLocale(locale, {
            zh: "这些数值要尽量贴近现实。学习者首页、练习队列和复盘压力都会继承这份档案。",
            en: "Keep these values realistic. The learner home, practice queue, and review pressure all inherit from this one profile."
          })}
        </p>
      </div>

      <label className="block space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "档案名称", en: "Profile name" })}
        </span>
        <input
          type="text"
          name="profileName"
          defaultValue={profile?.profileName ?? ""}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "学习轨道", en: "Track" })}
          </span>
          <select
            name="track"
            defaultValue={profile?.track ?? "dse"}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          >
            <option value="dse">{pickLocale(locale, { zh: "DSE 主轨", en: "DSE" })}</option>
            <option value="foundation_to_dse">
              {pickLocale(locale, { zh: "基础衔接 DSE", en: "Foundation to DSE" })}
            </option>
            <option value="companion">
              {pickLocale(locale, { zh: "陪伴模式", en: "Companion" })}
            </option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "学段", en: "School stage" })}
          </span>
          <select
            name="schoolStage"
            defaultValue={profile?.schoolStage ?? "f3"}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          >
            <option value="p5">{pickLocale(locale, { zh: "小五", en: "P5" })}</option>
            <option value="f3">{pickLocale(locale, { zh: "中三", en: "F3" })}</option>
            <option value="adult">{pickLocale(locale, { zh: "成人", en: "Adult" })}</option>
            <option value="other">{pickLocale(locale, { zh: "其他", en: "Other" })}</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "每日学习分钟数", en: "Study minutes/day" })}
          </span>
          <input
            type="number"
            name="studyMinutesPerDay"
            defaultValue={profile?.studyMinutesPerDay ?? 45}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "每周学习天数", en: "Study days/week" })}
          </span>
          <input
            type="number"
            name="studyDaysPerWeek"
            defaultValue={profile?.studyDaysPerWeek ?? 6}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "目标参考等级", en: "Target reference level" })}
          </span>
          <input
            type="text"
            name="targetReferenceLevel"
            defaultValue={profile?.targetReferenceLevel ?? ""}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {pickLocale(locale, { zh: "目标内部分段", en: "Target internal band" })}
          </span>
          <input
            type="text"
            name="targetInternalBand"
            defaultValue={profile?.targetInternalBand ?? ""}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60 md:col-span-2 md:justify-self-start md:px-6"
      >
        {pending
          ? pickLocale(locale, { zh: "保存中...", en: "Saving..." })
          : pickLocale(locale, { zh: "保存档案", en: "Save Profile" })}
      </button>

      <p className="text-xs leading-5 text-[var(--text-muted)] md:col-span-2">
        {pickLocale(locale, {
          zh: "保存后先去看学习页。如果学习循环太重或太轻，先回来调整这里，再改练习内容。",
          en: "After saving, check learn first. If the loop feels too heavy or too light, come back here before changing practice content."
        })}
      </p>

      {state.status !== "idle" ? (
        <p
          className={`md:col-span-2 ${
            state.status === "error"
              ? "rounded-2xl bg-[rgba(196,90,64,0.08)] px-4 py-3 text-sm text-[#9f3a28]"
              : "rounded-2xl bg-[rgba(47,95,60,0.09)] px-4 py-3 text-sm text-[#2f5f3c]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
