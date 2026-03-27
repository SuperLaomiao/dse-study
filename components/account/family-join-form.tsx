"use client";

import { useActionState } from "react";

import {
  idleAccountActionState,
  joinFamilyAction
} from "@/app/actions/account";

export default function FamilyJoinForm() {
  const [state, action, pending] = useActionState(
    joinFamilyAction,
    idleAccountActionState
  );

  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Email</span>
        <input
          type="email"
          name="email"
          placeholder="brother@example.com"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Invite code</span>
        <input
          type="text"
          name="inviteCode"
          placeholder="CHAN-FAMILY"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm uppercase text-[#1f2a1f]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
      >
        {pending ? "Joining..." : "Join Family"}
      </button>
      {state.status !== "idle" ? (
        <p className={state.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
