import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "test-user", role: "learner" })),
  redirectIfSignedIn: vi.fn(async () => undefined)
}));

vi.mock("@/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "zh")
}));

import ProgressPage from "@/app/progress/page";
import AdminLearnerDetailPage from "@/app/admin/learner/[id]/page";

describe("core page i18n coverage", () => {
  it("renders the progress page in chinese when locale is zh", async () => {
    render(await ProgressPage());

    expect(screen.getByRole("heading", { name: "进度" })).toBeInTheDocument();
    expect(screen.getByText("最新口语 AI 信号")).toBeInTheDocument();
    expect(screen.getByText("最近一次训练")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开口语工作台" })).toHaveAttribute(
      "href",
      "/practice/speaking"
    );
  });

  it("renders admin learner detail labels in chinese when locale is zh", async () => {
    render(
      await AdminLearnerDetailPage({
        params: Promise.resolve({ id: "older-brother" })
      })
    );

    expect(screen.getByText("学习节奏")).toBeInTheDocument();
    expect(screen.getByText("口语 AI 观察")).toBeInTheDocument();
    expect(screen.getByText("家长摘要")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开口语工作台" })).toHaveAttribute(
      "href",
      "/practice/speaking"
    );
  });
});
