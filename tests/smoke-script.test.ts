import { describe, expect, it } from "vitest";

import { getCloudbaseSmokeTargets, getSmokeFailure } from "@/lib/smoke";

describe("smoke helpers", () => {
  it("treats protected admin routes as valid when they redirect to sign-in", () => {
    const protectedRoute = getCloudbaseSmokeTargets().find(
      (target) => target.path === "/admin/family"
    );

    expect(protectedRoute).toBeDefined();
    expect(
      getSmokeFailure("/admin/family", "<html><body><h1>Sign In</h1></body></html>", protectedRoute!.expectAnyText)
    ).toBeNull();
  });

  it("fails when none of the expected markers are present", () => {
    expect(getSmokeFailure("/admin/system", "<html><body>Not Found</body></html>", ["Database Ops", "Sign In"])).toContain(
      "/admin/system"
    );
  });

  it("includes a public health endpoint in the smoke targets", () => {
    expect(getCloudbaseSmokeTargets().some((target) => target.path === "/api/health")).toBe(true);
  });
});
