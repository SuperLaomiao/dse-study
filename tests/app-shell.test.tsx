import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "test-user", role: "learner" })),
  redirectIfSignedIn: vi.fn(async () => undefined)
}));

import AppShell from "@/components/app-shell";
import AdminFamilyPage from "@/app/admin/family/page";
import HomePage from "@/app/home/page";
import AdminLearnerDetailPage from "@/app/admin/learner/[id]/page";

describe("phase 0 app shell", () => {
  it("renders learner navigation items in the shared shell", () => {
    render(
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
  });

  it("shows the older brother daily plan on the learner home page", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", { name: "Older Brother" })
    ).toBeInTheDocument();
    expect(screen.getByText("Daily Plan")).toBeInTheDocument();
  });

  it("shows the family summary on the admin family page", async () => {
    render(await AdminFamilyPage());

    expect(
      screen.getByRole("heading", { name: "Family Overview" })
    ).toBeInTheDocument();
    expect(screen.getByText("Mom Admin")).toBeInTheDocument();
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
