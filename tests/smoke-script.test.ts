import { describe, expect, it } from "vitest";

import {
  getCloudbaseSmokeTargets,
  getSmokeFailure,
  summarizeSmokeFailures
} from "@/lib/smoke";

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

  it("surfaces health-route issue codes when the payload reports a failure", () => {
    const failure = getSmokeFailure(
      "/api/health",
      JSON.stringify({
        ok: false,
        app: "dse-study",
        database: {
          issueCode: "network",
          summary: "CloudBase MySQL is configured, but the runtime cannot reach the network path to the database yet."
        }
      }),
      ['"app":"dse-study"', '"database"']
    );

    expect(failure).toContain("issueCode=network");
    expect(failure).toContain("network path");
  });

  it("accepts health payloads that report the app as healthy", () => {
    expect(
      getSmokeFailure(
        "/api/health",
        JSON.stringify({
          ok: true,
          app: "dse-study",
          database: {
            issueCode: "none",
            summary: "CloudBase MySQL is reachable and seeded."
          }
        }),
        ['"app":"dse-study"', '"database"']
      )
    ).toBeNull();
  });

  it("adds a deployment hint when the new health and admin routes both 404", () => {
    expect(
      summarizeSmokeFailures(["/api/health returned 404", "/admin/system returned 404"]).some((line) =>
        line.includes("CloudBase is still serving an older deployment")
      )
    ).toBe(true);
  });
});
