"use server";

import { redirect } from "next/navigation";

import type { AccountActionState } from "@/lib/action-states";
import {
  validateCreateFamilyInput,
  validateJoinFamilyInput,
  validateSignInEmail
} from "@/lib/auth/account-flow";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { getCurrentSession, setSessionCookie } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import {
  createFamilySetup,
  findSignInUserByEmail,
  joinFamilyMembership
} from "@/lib/repositories/account-repository";

export async function signInWithEmailAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? email.trim()
        ? { ok: true as const }
        : { ok: false as const, message: "Email is required." }
      : validateSignInEmail(email);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  const user = await findSignInUserByEmail(email);

  if (!user) {
    return {
      status: "error",
      message:
        getDataAccessMode() === "database"
          ? "No account was found for this email."
          : "Use one of the current demo emails to sign in."
    } satisfies AccountActionState;
  }

  await setSessionCookie(user);
  redirect(getPostSignInRedirect(user.role));
}

export async function createFamilyAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const familyName = String(formData.get("familyName") ?? "");
  const parentName = String(formData.get("parentName") ?? "");
  const validation = validateCreateFamilyInput({ familyName, parentName });

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: `${familyName} is ready for demo setup. Invite flow will be persisted in the next slice.`
    } satisfies AccountActionState;
  }

  try {
    const session = await getCurrentSession();
    await createFamilySetup({
      familyName,
      parentName,
      session
    });

    return {
      status: "success",
      message: `${familyName} saved. Demo learner invites are ready to join.`
    } satisfies AccountActionState;
  } catch (error) {
    console.error("create family action failed", error);
    return {
      status: "error",
      message: "Unable to save the family right now."
    } satisfies AccountActionState;
  }
}

export async function joinFamilyAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? !email.trim()
        ? { ok: false as const, message: "Email is required." }
        : !inviteCode.trim()
          ? { ok: false as const, message: "Invite code is required." }
          : { ok: true as const }
      : validateJoinFamilyInput({ email, inviteCode });

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: "Demo join successful. Real invitation persistence comes next."
    } satisfies AccountActionState;
  }

  try {
    const result = await joinFamilyMembership({
      email,
      inviteCode
    });

    if (!result) {
      return {
        status: "error",
        message: "Invite code or learner email could not be matched."
      } satisfies AccountActionState;
    }

    return {
      status: "success",
      message: `Joined ${result.familyName}. Your learner access is now active.`
    } satisfies AccountActionState;
  } catch (error) {
    console.error("join family action failed", error);
    return {
      status: "error",
      message: "Unable to join the family right now."
    } satisfies AccountActionState;
  }
}
