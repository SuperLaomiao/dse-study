"use client";

import { useActionState } from "react";

import { signInWithEmailAction } from "@/app/actions/account";
import { idleAccountActionState } from "@/lib/action-states";

export default function EmailSignInForm() {
  const [state, action, pending] = useActionState(
    signInWithEmailAction,
    idleAccountActionState
  );

  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Email</span>
        <input
          type="email"
          name="email"
          placeholder="mom@example.com"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-xs text-[#586857]">
        Demo emails: `mom@example.com`, `brother@example.com`, `sister@example.com`
      </p>
      {state.status !== "idle" ? (
        <p className={state.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
