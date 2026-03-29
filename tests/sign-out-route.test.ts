import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/account/sign-out/route";

describe("sign-out route", () => {
  it("clears the session cookie and redirects back to sign-in", async () => {
    const request = new Request("http://localhost:3000/api/account/sign-out", {
      method: "POST"
    });

    const response = await POST(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/sign-in");
    expect(response.headers.get("set-cookie")).toContain("dse-study-session=");
  });
});
