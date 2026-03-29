import { render, screen } from "@testing-library/react";

import PracticeVocabularyPage from "@/app/practice/vocabulary/page";
import PracticeReadingPage from "@/app/practice/reading/page";

describe("practice module pages", () => {
  it("renders a richer vocabulary training page", () => {
    render(<PracticeVocabularyPage />);

    expect(screen.getByRole("heading", { name: "Vocabulary Loop" })).toBeInTheDocument();
    expect(screen.getByText("Loop cadence")).toBeInTheDocument();
    expect(screen.getByText("Recall drill")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to practice hub" })).toHaveAttribute(
      "href",
      "/practice"
    );
  });

  it("renders a richer reading training page", () => {
    render(<PracticeReadingPage />);

    expect(screen.getByRole("heading", { name: "Reading" })).toBeInTheDocument();
    expect(screen.getByText("Inference set")).toBeInTheDocument();
    expect(screen.getByText("Timing support")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open progress" })).toHaveAttribute(
      "href",
      "/progress"
    );
  });
});
