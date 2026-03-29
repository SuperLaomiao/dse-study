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

  it("renders clear next-step links for new families and invited learners", async () => {
    render(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByText("Choose the fastest route into the demo or onboarding flow.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create a Family/i })).toHaveAttribute(
      "href",
      "/family/create"
    );
    expect(screen.getByRole("link", { name: /Join a Family/i })).toHaveAttribute(
      "href",
      "/family/join"
    );
    expect(screen.getByRole("link", { name: /Preview Learner Home/i })).toHaveAttribute(
      "href",
      "/home"
    );
  });
});
