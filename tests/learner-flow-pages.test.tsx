import { render, screen } from "@testing-library/react";

import BaselineAssessmentPage from "@/app/assessment/baseline/page";
import LearnPage from "@/app/learn/page";
import BiweeklyReviewPage from "@/app/review/biweekly/page";

describe("learner flow pages", () => {
  it("renders a richer learn page with action links", () => {
    render(<LearnPage />);

    expect(screen.getByRole("heading", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByText("Today’s learning loop")).toBeInTheDocument();
    expect(screen.getByText("Reason stack")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open practice hub" })).toHaveAttribute(
      "href",
      "/practice"
    );
    expect(screen.getByRole("link", { name: "Review progress" })).toHaveAttribute(
      "href",
      "/progress"
    );
  });

  it("renders a clearer baseline assessment page", () => {
    render(<BaselineAssessmentPage />);

    expect(screen.getByRole("heading", { name: "Baseline Assessment" })).toBeInTheDocument();
    expect(screen.getByText("Diagnostic mix")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary snapshot")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue to practice" })).toHaveAttribute(
      "href",
      "/practice"
    );
  });

  it("renders a readable bi-weekly review page", () => {
    render(<BiweeklyReviewPage />);

    expect(screen.getByRole("heading", { name: "Bi-weekly Review" })).toBeInTheDocument();
    expect(screen.getByText("Reset decisions")).toBeInTheDocument();
    expect(screen.getByText("Keep")).toBeInTheDocument();
    expect(screen.getByText("Tighten")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open progress" })).toHaveAttribute(
      "href",
      "/progress"
    );
  });
});
