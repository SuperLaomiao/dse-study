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
import PracticeHubPage from "@/app/practice/page";
import ProgressPage from "@/app/progress/page";

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

  it("renders admin quick links and sign out controls in the shared shell", () => {
    render(
      <AppShell
        role="admin"
        title="Family Overview"
        description="Admin dashboard"
        currentPath="/admin/family"
      >
        <div>Shell content</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "Family Admin" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "Family" })).toHaveAttribute("href", "/admin/family");
    expect(screen.getByRole("link", { name: "Alerts" })).toHaveAttribute("href", "/admin/alerts");
    expect(screen.getByRole("link", { name: "System" })).toHaveAttribute("href", "/admin/system");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "Start practice" })).toHaveAttribute("href", "/practice");
    expect(screen.getByRole("link", { name: "Review progress" })).toHaveAttribute("href", "/progress");
  });

  it("turns the practice hub into a real action surface", async () => {
    render(await PracticeHubPage());

    expect(screen.getByRole("heading", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByText("Recommended next move")).toBeInTheDocument();
    expect(screen.getAllByText("Vocabulary Loop").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open vocabulary module" })).toHaveAttribute(
      "href",
      "/practice/vocabulary"
    );
    expect(screen.getByRole("link", { name: "Open reading module" })).toHaveAttribute(
      "href",
      "/practice/reading"
    );
  });

  it("shows a readable progress overview instead of a single line", async () => {
    render(await ProgressPage());

    expect(screen.getByRole("heading", { name: "Progress" })).toBeInTheDocument();
    expect(screen.getByText("Reference level arc")).toBeInTheDocument();
    expect(screen.getByText("B1+ now")).toBeInTheDocument();
    expect(screen.getByText("Band 4.2 working band")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open baseline assessment" })).toHaveAttribute(
      "href",
      "/assessment/baseline"
    );
    expect(screen.getByRole("link", { name: "See bi-weekly review" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
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
    expect(screen.getByRole("link", { name: "Open Older Brother" })).toHaveAttribute(
      "href",
      "/admin/learner/older-brother"
    );
    expect(screen.getByRole("link", { name: "Open Alerts Board" })).toHaveAttribute(
      "href",
      "/admin/alerts"
    );
    expect(screen.getByRole("link", { name: "Open System Checks" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(container.querySelector("section")).toHaveClass("md:p-6");
  });

  it("groups the admin alerts into more readable sections", async () => {
    render(await AdminAlertsPage());

    expect(screen.getByRole("heading", { name: "Alerts" })).toBeInTheDocument();
    expect(screen.getByText("Needs attention now")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Decision lanes")).toBeInTheDocument();
    expect(screen.getAllByText("Bi-weekly review due soon").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Recovery plan ready").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open Family Dashboard" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "Open System Checks" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(screen.getByRole("link", { name: "Open Health Check" })).toHaveAttribute(
      "href",
      "/api/health"
    );
    expect(screen.getByText("Older Brother")).toBeInTheDocument();
    expect(screen.getByText("Younger Sister")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open learner detail: Older Brother" })).toHaveAttribute(
      "href",
      "/admin/learner/older-brother"
    );
    expect(screen.getByRole("link", { name: "Open learner detail: Younger Sister" })).toHaveAttribute(
      "href",
      "/admin/learner/younger-sister"
    );
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

  it("renders a richer admin learner detail view for a known learner", async () => {
    render(
      await AdminLearnerDetailPage({
        params: Promise.resolve({ id: "older-brother" })
      })
    );

    expect(screen.getByRole("heading", { name: "Older Brother" })).toBeInTheDocument();
    expect(screen.getByText("Study cadence")).toBeInTheDocument();
    expect(screen.getByText("50 min/day")).toBeInTheDocument();
    expect(screen.getByText("6 days/week")).toBeInTheDocument();
    expect(screen.getByText("Target trajectory")).toBeInTheDocument();
    expect(screen.getByText("Band 5*")).toBeInTheDocument();
    expect(screen.getByText("Quick actions")).toBeInTheDocument();
    expect(screen.getByText("Today's queue")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary Loop")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Family Overview" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "Open System" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(screen.getByRole("link", { name: "Open practice hub" })).toHaveAttribute(
      "href",
      "/practice"
    );
    expect(screen.getByRole("link", { name: "Open progress" })).toHaveAttribute(
      "href",
      "/progress"
    );
    expect(screen.getByRole("link", { name: "Next learner: Younger Sister" })).toHaveAttribute(
      "href",
      "/admin/learner/younger-sister"
    );
  });
});
