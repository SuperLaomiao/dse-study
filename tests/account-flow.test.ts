import { describe, expect, it } from "vitest";

import {
  validateCreateFamilyInput,
  validateJoinFamilyInput,
  validateSignInEmail
} from "@/lib/auth/account-flow";

describe("account flow validation", () => {
  it("accepts a known demo sign-in email", () => {
    expect(validateSignInEmail("mom@example.com")).toEqual({
      ok: true
    });
  });

  it("rejects an unknown sign-in email", () => {
    expect(validateSignInEmail("unknown@example.com")).toEqual({
      ok: false,
      message: "Use one of the current demo emails to sign in."
    });
  });

  it("accepts a valid family create payload", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "Chan Family",
        parentName: "Mom Admin"
      })
    ).toEqual({
      ok: true
    });
  });

  it("rejects a blank family name", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "",
        parentName: "Mom Admin"
      })
    ).toEqual({
      ok: false,
      message: "Family name is required."
    });
  });

  it("accepts a matching demo family join payload", () => {
    expect(
      validateJoinFamilyInput({
        email: "brother@example.com",
        inviteCode: "CHAN-FAMILY"
      })
    ).toEqual({
      ok: true
    });
  });

  it("rejects an invalid family join code", () => {
    expect(
      validateJoinFamilyInput({
        email: "brother@example.com",
        inviteCode: "WRONG"
      })
    ).toEqual({
      ok: false,
      message: "Invite code is not valid for the current demo family."
    });
  });
});
