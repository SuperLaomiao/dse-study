"use client";

import { useActionState } from "react";

import {
  createFamilyAction,
  idleAccountActionState
} from "@/app/actions/account";

export default function FamilyCreateForm() {
  const [state, action, pending] = useActionState(
    createFamilyAction,
    idleAccountActionState
  );

  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Family name</span>
        <input
          type="text"
          name="familyName"
          placeholder="Chan Family"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Parent name</span>
        <input
          type="text"
          name="parentName"
          placeholder="Mom Admin"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Create Family"}
      </button>
      {state.status !== "idle" ? (
        <p className={state.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
