"use server";

import { redirect } from "next/navigation";

import {
  validateCreateFamilyInput,
  validateJoinFamilyInput,
  validateSignInEmail
} from "@/lib/auth/account-flow";
import { findDemoUserByEmail, getPostSignInRedirect } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/server";

export interface AccountActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const idleAccountActionState: AccountActionState = {
  status: "idle",
  message: ""
};

export async function signInWithEmailAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const validation = validateSignInEmail(email);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  const user = findDemoUserByEmail(email);

  if (!user) {
    return {
      status: "error",
      message: "Use one of the current demo emails to sign in."
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

  return {
    status: "success",
    message: `${familyName} is ready for demo setup. Invite flow will be persisted in the next slice.`
  } satisfies AccountActionState;
}

export async function joinFamilyAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "");
  const validation = validateJoinFamilyInput({ email, inviteCode });

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  return {
    status: "success",
    message: "Demo join successful. Real invitation persistence comes next."
  } satisfies AccountActionState;
}
