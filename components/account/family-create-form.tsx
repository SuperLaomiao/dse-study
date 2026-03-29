"use client";

import { useActionState } from "react";

import { createFamilyAction } from "@/app/actions/account";
import { idleAccountActionState } from "@/lib/action-states";

export default function FamilyCreateForm() {
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Admin-first setup</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Use the household name the learner will recognize. The parent name becomes the admin label on family overview and alerts.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">Family name</span>
        <input
          type="text"
          name="familyName"
          placeholder="Chan Family"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">Parent name</span>
        <input
          type="text"
          name="parentName"
          placeholder="Mom Admin"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(88,104,87,0.68)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Create Family"}
      </button>
      <p className="text-xs leading-5 text-[var(--text-muted)]">
        Next: send the learner to the join route so both people land in one shared family space.
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
