"use client";

import { useActionState } from "react";

import { saveLearnerProfileAction } from "@/app/actions/profile";
import { idleProfileActionState } from "@/lib/action-states";
import type { LearnerProfileRecord } from "@/lib/types";

export default function OnboardingProfileForm({
  profile
}: {
  profile: LearnerProfileRecord | null;
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Calibration</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Keep these values realistic. The learner home, practice queue, and review pressure all inherit from this one profile.
        </p>
      </div>

      <label className="block space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-[var(--foreground)]">Profile name</span>
        <input
          type="text"
          name="profileName"
          defaultValue={profile?.profileName ?? ""}
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Track</span>
          <select
            name="track"
            defaultValue={profile?.track ?? "dse"}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          >
            <option value="dse">DSE</option>
            <option value="foundation_to_dse">Foundation to DSE</option>
            <option value="companion">Companion</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">School stage</span>
          <select
            name="schoolStage"
            defaultValue={profile?.schoolStage ?? "f3"}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          >
            <option value="p5">P5</option>
            <option value="f3">F3</option>
            <option value="adult">Adult</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Study minutes/day</span>
          <input
            type="number"
            name="studyMinutesPerDay"
            defaultValue={profile?.studyMinutesPerDay ?? 45}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Study days/week</span>
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
          <span className="text-sm font-medium text-[var(--foreground)]">Target reference level</span>
          <input
            type="text"
            name="targetReferenceLevel"
            defaultValue={profile?.targetReferenceLevel ?? ""}
            className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Target internal band</span>
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
        {pending ? "Saving..." : "Save Profile"}
      </button>

      <p className="text-xs leading-5 text-[var(--text-muted)] md:col-span-2">
        After saving, check learn first. If the loop feels too heavy or too light, come back here before changing practice content.
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
