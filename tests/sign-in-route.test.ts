import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/account/sign-in/route";

describe("sign-in route", () => {
  it("redirects back to sign-in with an error when email is missing", async () => {
    const request = new Request("http://localhost:3000/api/account/sign-in", {
      method: "POST",
      body: new URLSearchParams({
        password: "demo-admin-pass"
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/sign-in?error=");
  });

  it("redirects back to sign-in with an error when password is missing", async () => {
    const request = new Request("http://localhost:3000/api/account/sign-in", {
      method: "POST",
      body: new URLSearchParams({
        email: "mom@example.com"
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/sign-in?error=");
  });

  it("sets the session cookie and redirects admins to the family page", async () => {
    const request = new Request("http://localhost:3000/api/account/sign-in", {
      method: "POST",
      body: new URLSearchParams({
        email: "mom@example.com",
        password: "demo-admin-pass"
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/admin/family");
    expect(response.headers.get("set-cookie")).toContain("dse-study-session=");
  });
});
