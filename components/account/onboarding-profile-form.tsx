"use client";

import { useActionState } from "react";

import {
  idleProfileActionState,
  saveLearnerProfileAction
} from "@/app/actions/profile";
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
    <form action={action} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Profile name</span>
        <input
          type="text"
          name="profileName"
          defaultValue={profile?.profileName ?? ""}
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#1f2a1f]">Track</span>
          <select
            name="track"
            defaultValue={profile?.track ?? "dse"}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
          >
            <option value="dse">DSE</option>
            <option value="foundation_to_dse">Foundation to DSE</option>
            <option value="companion">Companion</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#1f2a1f]">School stage</span>
          <select
            name="schoolStage"
            defaultValue={profile?.schoolStage ?? "f3"}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
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
          <span className="text-sm font-medium text-[#1f2a1f]">Study minutes/day</span>
          <input
            type="number"
            name="studyMinutesPerDay"
            defaultValue={profile?.studyMinutesPerDay ?? 45}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#1f2a1f]">Study days/week</span>
          <input
            type="number"
            name="studyDaysPerWeek"
            defaultValue={profile?.studyDaysPerWeek ?? 6}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#1f2a1f]">Target reference level</span>
          <input
            type="text"
            name="targetReferenceLevel"
            defaultValue={profile?.targetReferenceLevel ?? ""}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#1f2a1f]">Target internal band</span>
          <input
            type="text"
            name="targetInternalBand"
            defaultValue={profile?.targetInternalBand ?? ""}
            className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Profile"}
      </button>

      {state.status !== "idle" ? (
        <p className={state.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
