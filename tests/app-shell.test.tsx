import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "test-user", role: "learner" })),
  redirectIfSignedIn: vi.fn(async () => undefined)
}));

import AppShell from "@/components/app-shell";
import AdminFamilyPage from "@/app/admin/family/page";
import AdminAlertsPage from "@/app/admin/alerts/page";
import HomePage from "@/app/home/page";
import AdminLearnerDetailPage from "@/app/admin/learner/[id]/page";

describe("phase 0 app shell", () => {
  it("renders learner navigation items in the shared shell", () => {
    const { container } = render(
      <AppShell
        role="learner"
        title="Home"
        description="Daily plan and progress"
      >
        <div>Shell content</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Progress" })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("md:max-w-4xl");
    expect(container.firstChild).toHaveClass("md:px-6");
  });

  it("shows a richer learner learning snapshot on the home page", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", { name: "Older Brother" })
    ).toBeInTheDocument();
    expect(screen.getByText("Learning snapshot")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Current focus")).toBeInTheDocument();
    expect(screen.getByText("Inference")).toBeInTheDocument();
  });

  it("shows a household overview with learner cards on the admin family page", async () => {
    const { container } = render(await AdminFamilyPage());

    expect(
      screen.getByRole("heading", { name: "Family Overview" })
    ).toBeInTheDocument();
    expect(screen.getByText("Household snapshot")).toBeInTheDocument();
    expect(screen.getByText("Mom Admin")).toBeInTheDocument();
    expect(screen.getByText("Older Brother")).toBeInTheDocument();
    expect(screen.getByText("Younger Sister")).toBeInTheDocument();
    expect(screen.getAllByText("Focus")).toHaveLength(2);
    expect(container.querySelector("section")).toHaveClass("md:p-6");
  });

  it("groups the admin alerts into more readable sections", async () => {
    render(await AdminAlertsPage());

    expect(screen.getByRole("heading", { name: "Alerts" })).toBeInTheDocument();
    expect(screen.getByText("Needs attention now")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Bi-weekly review due soon")).toBeInTheDocument();
    expect(screen.getByText("Recovery plan ready")).toBeInTheDocument();
  });

  it("shows a safe fallback for an unknown learner detail route", async () => {
    render(
      await AdminLearnerDetailPage({
        params: Promise.resolve({ id: "missing-learner" })
      })
    );

    expect(screen.getByText("Learner not found")).toBeInTheDocument();
    expect(screen.getByText("Back to Family Overview")).toBeInTheDocument();
  });
});
