import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  redirectIfSignedIn: vi.fn(async () => undefined)
}));

import SignInPage from "@/app/sign-in/page";

describe("sign-in page", () => {
  it("renders a route error message from search params", async () => {
    render(
      await SignInPage({
        searchParams: Promise.resolve({
          error: "Email is required."
        })
      })
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });
});
