import { render, screen } from "@testing-library/react";

import PracticeVocabularyPage from "@/app/practice/vocabulary/page";
import PracticeReadingPage from "@/app/practice/reading/page";
import PracticeListeningPage from "@/app/practice/listening/page";
import PracticeSpeakingPage from "@/app/practice/speaking/page";
import PracticeWritingPage from "@/app/practice/writing/page";

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

  it("renders a richer listening training page", () => {
    render(<PracticeListeningPage />);

    expect(screen.getByRole("heading", { name: "Listening" })).toBeInTheDocument();
    expect(screen.getByText("Session board")).toBeInTheDocument();
    expect(screen.getByText("Note capture")).toBeInTheDocument();
    expect(screen.getByText("Replay discipline")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See review rhythm" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });

  it("renders a richer speaking training page", () => {
    render(<PracticeSpeakingPage />);

    expect(screen.getByRole("heading", { name: "Speaking AI Studio" })).toBeInTheDocument();
    expect(screen.getAllByText("AI feedback studio")).toHaveLength(2);
    expect(screen.getByRole("radio", { name: "Pattern mode" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Exam mode" })).toBeInTheDocument();
    expect(screen.getByLabelText("Upload speaking audio")).toBeInTheDocument();
  });

  it("renders a richer writing training page", () => {
    render(<PracticeWritingPage />);

    expect(screen.getByRole("heading", { name: "Writing" })).toBeInTheDocument();
    expect(screen.getByText("Session board")).toBeInTheDocument();
    expect(screen.getByText("Structure before draft")).toBeInTheDocument();
    expect(screen.getByText("Draft restraint")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See review rhythm" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });
});
