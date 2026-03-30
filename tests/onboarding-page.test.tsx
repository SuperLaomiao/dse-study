import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "older-brother", role: "learner" }))
}));

import OnboardingProfilePage from "@/app/onboarding/profile/page";

describe("onboarding profile page", () => {
  it("renders the interactive learner profile form", async () => {
    const { container } = render(await OnboardingProfilePage());

    expect(screen.getByLabelText("档案名称")).toBeInTheDocument();
    expect(screen.getByLabelText("学习轨道")).toBeInTheDocument();
    expect(screen.getByLabelText("学段")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存档案" })).toBeInTheDocument();
    expect(container.querySelector("form")).toHaveClass("md:grid-cols-2");
  });
});
