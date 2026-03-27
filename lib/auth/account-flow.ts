import { findDemoUserByEmail } from "@/lib/auth/session";

type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateSignInEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { ok: false, message: "Email is required." };
  }

  if (!findDemoUserByEmail(email)) {
    return {
      ok: false,
      message: "Use one of the current demo emails to sign in."
    };
  }

  return { ok: true };
}

export function validateCreateFamilyInput(input: {
  familyName: string;
  parentName: string;
}): ValidationResult {
  if (!input.familyName.trim()) {
    return { ok: false, message: "Family name is required." };
  }

  if (!input.parentName.trim()) {
    return { ok: false, message: "Parent name is required." };
  }

  return { ok: true };
}

export function validateJoinFamilyInput(input: {
  email: string;
  inviteCode: string;
}): ValidationResult {
  if (!input.email.trim()) {
    return { ok: false, message: "Email is required." };
  }

  if (!input.inviteCode.trim()) {
    return { ok: false, message: "Invite code is required." };
  }

  if (input.inviteCode.trim().toUpperCase() !== "CHAN-FAMILY") {
    return {
      ok: false,
      message: "Invite code is not valid for the current demo family."
    };
  }

  if (!findDemoUserByEmail(input.email)) {
    return {
      ok: false,
      message: "Use one of the current demo learner emails to join the family."
    };
  }

  return { ok: true };
}
