import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "older-brother", role: "learner" }))
}));

import AssessmentWelcomePage from "@/app/assessment/welcome/page";
import ProgressPage from "@/app/progress/page";
import ReviewResultPage from "@/app/review/result/page";
import { describe, it, expect } from "vitest";

describe("learner result pages", () => {
  it("renders baseline assessment welcome page", async () => {
    const page = await AssessmentWelcomePage();
    render(page);

    expect(screen.getByRole("heading", { name: "基线水平评估" })).toBeInTheDocument();
    expect(screen.getByText("评估信息")).toBeInTheDocument();
    expect(
      screen.getByText("本次结果会写入 Older Brother 的学习档案，并影响接下来两周的起始难度。")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始评估" })).toHaveAttribute(
      "href",
      "/assessment/take"
    );
  });

  it("renders a richer progress page", async () => {
    const page = await ProgressPage();
    render(page);

    expect(screen.getByRole("heading", { name: /进度|Progress/ })).toBeInTheDocument();
    expect(screen.getByText(/参考等级轨迹|Reference level trajectory/)).toBeInTheDocument();
  });

  it("renders a richer review result page", async () => {
    const page = await ReviewResultPage();
    render(page);

    expect(screen.getByRole("heading", { name: /复盘结果|Review Result/ })).toBeInTheDocument();
    expect(screen.getByText(/周期结论|Cycle conclusion/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /返回学习页|Back to learn/ })).toHaveAttribute(
      "href",
      "/learn"
    );
  });
});
