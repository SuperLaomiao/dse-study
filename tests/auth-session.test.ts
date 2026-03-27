import { describe, expect, it } from "vitest";

import {
  findDemoUserByEmail,
  getPostSignInRedirect,
  parseSessionCookie,
  requireRole
} from "@/lib/auth/session";

describe("auth session helpers", () => {
  it("finds the admin demo user from email", () => {
    const user = findDemoUserByEmail("mom@example.com");

    expect(user?.role).toBe("admin");
    expect(user?.name).toBe("Mom Admin");
  });

  it("returns null for an unknown email", () => {
    expect(findDemoUserByEmail("nobody@example.com")).toBeNull();
  });

  it("parses a valid session cookie payload", () => {
    expect(
      parseSessionCookie(
        JSON.stringify({
          userId: "mom-admin",
          role: "admin"
        })
      )
    ).toEqual({
      userId: "mom-admin",
      role: "admin"
    });
  });

  it("rejects invalid session payloads", () => {
    expect(parseSessionCookie("oops")).toBeNull();
  });

  it("maps admin and learner users to the correct post sign-in route", () => {
    expect(getPostSignInRedirect("admin")).toBe("/admin/family");
    expect(getPostSignInRedirect("learner")).toBe("/home");
  });

  it("allows matching protected roles", () => {
    expect(requireRole({ userId: "mom-admin", role: "admin" }, "admin")).toBe(true);
  });

  it("rejects non-matching protected roles", () => {
    expect(requireRole({ userId: "older-brother", role: "learner" }, "admin")).toBe(false);
  });
});
