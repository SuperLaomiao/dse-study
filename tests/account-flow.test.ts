import { describe, expect, it } from "vitest";

import {
  validateCreateFamilyInput,
  validateJoinFamilyInput,
  validateSignInInput
} from "@/lib/auth/account-flow";

describe("account flow validation", () => {
  it("accepts a known demo sign-in with the matching password", () => {
    expect(
      validateSignInInput({
        email: "mom@example.com",
        password: "demo-admin-pass"
      })
    ).toEqual({
      ok: true
    });
  });

  it("rejects an unknown sign-in email", () => {
    expect(
      validateSignInInput({
        email: "unknown@example.com",
        password: "demo-admin-pass"
      })
    ).toEqual({
      ok: false,
      message: "Use one of the current demo emails to sign in."
    });
  });

  it("rejects a known demo email when the password is wrong", () => {
    expect(
      validateSignInInput({
        email: "mom@example.com",
        password: "wrong-password"
      })
    ).toEqual({
      ok: false,
      message: "Email or password is incorrect."
    });
  });

  it("accepts a valid family create payload", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "Chan Family",
        parentName: "Mom Admin",
        email: "mom@example.com",
        password: "ParentPass123"
      })
    ).toEqual({
      ok: true
    });
  });

  it("rejects a blank family name", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "",
        parentName: "Mom Admin",
        email: "mom@example.com",
        password: "ParentPass123"
      })
    ).toEqual({
      ok: false,
      message: "Family name is required."
    });
  });

  it("rejects a blank create-family email", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "Chan Family",
        parentName: "Mom Admin",
        email: "",
        password: "ParentPass123"
      })
    ).toEqual({
      ok: false,
      message: "Email is required."
    });
  });

  it("rejects a blank create-family password", () => {
    expect(
      validateCreateFamilyInput({
        familyName: "Chan Family",
        parentName: "Mom Admin",
        email: "mom@example.com",
        password: ""
      })
    ).toEqual({
      ok: false,
      message: "Password is required."
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

  it("can return chinese validation feedback when requested", () => {
    expect(
      validateCreateFamilyInput(
        {
          familyName: "",
          parentName: "Mom Admin",
          email: "mom@example.com",
          password: "ParentPass123"
        },
        "zh"
      )
    ).toEqual({
      ok: false,
      message: "请先填写家庭名称。"
    });
  });
});
