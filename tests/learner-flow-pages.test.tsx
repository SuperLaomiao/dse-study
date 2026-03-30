import { render, screen } from "@testing-library/react";

import BaselineAssessmentPage from "@/app/assessment/baseline/page";
import LearnPage from "@/app/learn/page";
import BiweeklyReviewPage from "@/app/review/biweekly/page";

describe("learner flow pages", () => {
  it("renders a richer learn page with action links", async () => {
    render(await LearnPage());

    expect(screen.getByRole("heading", { name: "学习" })).toBeInTheDocument();
    expect(screen.getByText("今日学习循环")).toBeInTheDocument();
    expect(screen.getByText("决策面板")).toBeInTheDocument();
    expect(screen.getByText("理由堆栈")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开练习中心" })).toHaveAttribute(
      "href",
      "/practice"
    );
    expect(screen.getByRole("link", { name: "查看进度" })).toHaveAttribute(
      "href",
      "/progress"
    );
    expect(screen.getByRole("link", { name: "打开双周复盘" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });

  it("renders a clearer baseline assessment page", async () => {
    render(await BaselineAssessmentPage());

    expect(screen.getByRole("heading", { name: "基线评估" })).toBeInTheDocument();
    expect(screen.getByText("Diagnostic mix")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary snapshot")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue to practice" })).toHaveAttribute(
      "href",
      "/practice"
    );
  });

  it("renders a readable bi-weekly review page", async () => {
    render(await BiweeklyReviewPage());

    expect(screen.getByRole("heading", { name: "双周复盘" })).toBeInTheDocument();
    expect(screen.getByText("重设决策")).toBeInTheDocument();
    expect(screen.getByText("复盘记分板")).toBeInTheDocument();
    expect(screen.getByText("保留")).toBeInTheDocument();
    expect(screen.getByText("收紧")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开进度页" })).toHaveAttribute(
      "href",
      "/progress"
    );
    expect(screen.getByRole("link", { name: "打开复盘结果" })).toHaveAttribute(
      "href",
      "/review/result"
    );
  });
});
