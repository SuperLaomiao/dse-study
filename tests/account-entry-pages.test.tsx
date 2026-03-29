import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "older-brother", role: "learner" }))
}));

import FamilyCreatePage from "@/app/family/create/page";
import FamilyJoinPage from "@/app/family/join/page";
import OnboardingProfilePage from "@/app/onboarding/profile/page";

describe("account entry pages", () => {
  it("renders a more guided family create page", () => {
    render(<FamilyCreatePage />);

    expect(screen.getByRole("heading", { name: "Create Family" })).toBeInTheDocument();
    expect(screen.getByText("What gets created")).toBeInTheDocument();
    expect(screen.getByText("Parent control seat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Family" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Already have an invite?" })).toHaveAttribute(
      "href",
      "/family/join"
    );
  });

  it("renders a more guided family join page", () => {
    render(<FamilyJoinPage />);

    expect(screen.getByRole("heading", { name: "Join Family" })).toBeInTheDocument();
    expect(screen.getByText("What you need")).toBeInTheDocument();
    expect(screen.getByText("Demo invite")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join Family" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Need to create the family first?" })).toHaveAttribute(
      "href",
      "/family/create"
    );
  });

  it("renders a richer onboarding profile page", async () => {
    render(await OnboardingProfilePage());

    expect(screen.getByRole("heading", { name: "Learner Profile" })).toBeInTheDocument();
    expect(screen.getByText("Profile settings")).toBeInTheDocument();
    expect(screen.getByText("Why this profile matters")).toBeInTheDocument();
    expect(screen.getByText("Daily capacity")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to learn" })).toHaveAttribute("href", "/learn");
    expect(screen.getByRole("button", { name: "Save Profile" })).toBeInTheDocument();
  });
});
