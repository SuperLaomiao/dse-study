import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "older-brother", role: "learner" })),
  getCurrentDemoUser: vi.fn(async () => ({ userId: "older-brother", role: "learner" }))
}));

import OnboardingProfilePage from "@/app/onboarding/profile/page";

describe("onboarding profile page", () => {
  it("renders the interactive learner profile form", async () => {
    render(await OnboardingProfilePage());

    expect(screen.getByLabelText("Profile name")).toBeInTheDocument();
    expect(screen.getByLabelText("Track")).toBeInTheDocument();
    expect(screen.getByLabelText("School stage")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Profile" })).toBeInTheDocument();
  });
});
