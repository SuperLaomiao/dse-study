import { render, screen } from "@testing-library/react";

import AssessmentResultPage from "@/app/assessment/result/page";
import ProgressPage from "@/app/progress/page";
import ReviewResultPage from "@/app/review/result/page";

describe("learner result pages", () => {
  it("renders a richer assessment result page", () => {
    render(<AssessmentResultPage />);

    expect(screen.getByRole("heading", { name: "Assessment Result" })).toBeInTheDocument();
    expect(screen.getByText("Reference snapshot")).toBeInTheDocument();
    expect(screen.getByText("Next cycle focus")).toBeInTheDocument();
    expect(screen.getByText("Decision handoff")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open practice" })).toHaveAttribute(
      "href",
      "/practice"
    );
    expect(screen.getByRole("link", { name: "Open bi-weekly review" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });

  it("renders a richer progress page", () => {
    render(<ProgressPage />);

    expect(screen.getByRole("heading", { name: "Progress" })).toBeInTheDocument();
    expect(screen.getByText("Reference level arc")).toBeInTheDocument();
    expect(screen.getByText("Checkpoint board")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View assessment result" })).toHaveAttribute(
      "href",
      "/assessment/result"
    );
  });

  it("renders a richer review result page", () => {
    render(<ReviewResultPage />);

    expect(screen.getByRole("heading", { name: "Review Result" })).toBeInTheDocument();
    expect(screen.getByText("Cycle verdict")).toBeInTheDocument();
    expect(screen.getByText("Reset for next sprint")).toBeInTheDocument();
    expect(screen.getByText("Next sprint checklist")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to learn" })).toHaveAttribute(
      "href",
      "/learn"
    );
    expect(screen.getByRole("link", { name: "Open practice" })).toHaveAttribute(
      "href",
      "/practice"
    );
  });
});
