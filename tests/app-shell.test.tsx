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
  it("renders learner navigation items in Chinese by default", () => {
    const { container } = render(
      <AppShell
        locale="zh"
        role="learner"
        title="首页"
        description="每日计划与进度"
      >
        <div>Shell content</div>
      </AppShell>
    );

    expect(screen.getByRole("button", { name: "中文" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "学习" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "练习" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "复习" })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("md:max-w-4xl");
    expect(container.firstChild).toHaveClass("md:px-6");
  });

  it("renders admin quick links and sign out controls in English when requested", () => {
    render(
      <AppShell
        locale="en"
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
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Family" })).toHaveAttribute("href", "/admin/family");
    expect(screen.getByRole("link", { name: "Alerts" })).toHaveAttribute("href", "/admin/alerts");
    expect(screen.getByRole("link", { name: "System" })).toHaveAttribute("href", "/admin/system");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("shows a richer learner learning snapshot on the home page", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { name: "哥哥" })).toBeInTheDocument();
    expect(screen.getByText("学习快照")).toBeInTheDocument();
    expect(screen.getByText("今天")).toBeInTheDocument();
    expect(screen.getByText("当前重点")).toBeInTheDocument();
    expect(screen.getByText("推断")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始练习" })).toHaveAttribute("href", "/practice");
    expect(screen.getByRole("link", { name: "查看进度" })).toHaveAttribute("href", "/progress");
  });

  it("turns the practice hub into a real action surface", async () => {
    render(await PracticeHubPage());

    expect(screen.getByRole("heading", { name: "练习" })).toBeInTheDocument();
    expect(screen.getByText("推荐下一步")).toBeInTheDocument();
    expect(screen.getAllByText("词汇循环").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "打开vocabulary模块" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "打开reading模块" }).length).toBeGreaterThan(0);
  });

  it("shows a readable progress overview instead of a single line", async () => {
    render(await ProgressPage());

    expect(screen.getByRole("heading", { name: "进度" })).toBeInTheDocument();
    expect(screen.getByText("参考等级轨迹")).toBeInTheDocument();
    expect(screen.getByText("B1+ 当前")).toBeInTheDocument();
    expect(screen.getByText("Band 4.2 工作分段")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开基线评估" })).toHaveAttribute(
      "href",
      "/assessment/baseline"
    );
    expect(screen.getByRole("link", { name: "查看双周复盘" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
    expect(screen.getByText("最新口语 AI 信号")).toBeInTheDocument();
    expect(screen.getByText("模式练习")).toBeInTheDocument();
    expect(screen.getByText("一旦回答离开熟悉提示框架，声音与表达就会明显收缩。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开口语工作台" })).toHaveAttribute(
      "href",
      "/practice/speaking"
    );
  });

  it("shows a household overview with learner cards on the admin family page", async () => {
    const { container } = render(await AdminFamilyPage());

    expect(screen.getByRole("heading", { name: "家庭总览" })).toBeInTheDocument();
    expect(screen.getByText("决策板")).toBeInTheDocument();
    expect(screen.getByText("当前提醒")).toBeInTheDocument();
    expect(screen.getByText("家庭概览")).toBeInTheDocument();
    expect(screen.getByText("妈妈管理员")).toBeInTheDocument();
    expect(screen.getByText("哥哥")).toBeInTheDocument();
    expect(screen.getByText("妹妹")).toBeInTheDocument();
    expect(screen.getAllByText("当前重点")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "打开 哥哥" })).toHaveAttribute(
      "href",
      "/admin/learner/older-brother"
    );
    expect(screen.getByRole("link", { name: "打开提醒看板" })).toHaveAttribute(
      "href",
      "/admin/alerts"
    );
    expect(screen.getByRole("link", { name: "打开系统检查" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(screen.getByRole("link", { name: "打开健康检查" })).toHaveAttribute(
      "href",
      "/api/health"
    );
    expect(container.querySelector("section")).toHaveClass("md:p-6");
  });

  it("groups the admin alerts into more readable sections", async () => {
    render(await AdminAlertsPage());

    expect(screen.getByRole("heading", { name: "提醒" })).toBeInTheDocument();
    expect(screen.getByText("需要立即处理")).toBeInTheDocument();
    expect(screen.getByText("即将到来")).toBeInTheDocument();
    expect(screen.getByText("学习者分栏")).toBeInTheDocument();
    expect(screen.getAllByText("双周复盘快到了").length).toBeGreaterThan(0);
    expect(screen.getAllByText("恢复计划已准备好").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "打开家庭看板" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "打开系统检查" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(screen.getByRole("link", { name: "打开健康检查" })).toHaveAttribute(
      "href",
      "/api/health"
    );
    expect(screen.getByText("哥哥")).toBeInTheDocument();
    expect(screen.getByText("妹妹")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开学习者详情：哥哥" })).toHaveAttribute(
      "href",
      "/admin/learner/older-brother"
    );
    expect(screen.getByRole("link", { name: "打开学习者详情：妹妹" })).toHaveAttribute(
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

    expect(screen.getByText("未找到学习者")).toBeInTheDocument();
    expect(screen.getByText("返回家庭总览")).toBeInTheDocument();
  });

  it("renders a richer admin learner detail view for a known learner", async () => {
    render(
      await AdminLearnerDetailPage({
        params: Promise.resolve({ id: "older-brother" })
      })
    );

    expect(screen.getByRole("heading", { name: "哥哥" })).toBeInTheDocument();
    expect(screen.getByText("学习节奏")).toBeInTheDocument();
    expect(screen.getByText("50 分钟/天")).toBeInTheDocument();
    expect(screen.getByText("6 天/周")).toBeInTheDocument();
    expect(screen.getByText("目标轨迹")).toBeInTheDocument();
    expect(screen.getByText("Band 5*")).toBeInTheDocument();
    expect(screen.getByText("快捷操作")).toBeInTheDocument();
    expect(screen.getByText("切换学习者")).toBeInTheDocument();
    expect(screen.getByText("关联提醒")).toBeInTheDocument();
    expect(screen.getByText("口语 AI 观察")).toBeInTheDocument();
    expect(screen.getByText("最近一次练习")).toBeInTheDocument();
    expect(screen.getByText("家长摘要")).toBeInTheDocument();
    expect(screen.getAllByText("当他必须超出背熟框架继续表达时，信心会明显下滑。").length).toBeGreaterThan(0);
    expect(screen.getAllByText("双周复盘快到了").length).toBeGreaterThan(0);
    expect(screen.getByText("今日任务队列")).toBeInTheDocument();
    expect(screen.getByText("词汇循环")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回家庭总览" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "打开系统页" })).toHaveAttribute(
      "href",
      "/admin/system"
    );
    expect(screen.getByRole("link", { name: "打开练习中心" })).toHaveAttribute(
      "href",
      "/practice"
    );
    expect(screen.getByRole("link", { name: "打开进度页" })).toHaveAttribute(
      "href",
      "/progress"
    );
    expect(screen.getByRole("link", { name: "打开提醒看板" })).toHaveAttribute(
      "href",
      "/admin/alerts"
    );
    expect(screen.getByRole("link", { name: "打开口语工作台" })).toHaveAttribute(
      "href",
      "/practice/speaking"
    );
    expect(screen.getByRole("link", { name: "下一位学习者：妹妹" })).toHaveAttribute(
      "href",
      "/admin/learner/younger-sister"
    );
    expect(screen.getByRole("link", { name: /学习者 妹妹/ })).toHaveAttribute(
      "href",
      "/admin/learner/younger-sister"
    );
    expect(screen.getByRole("link", { name: /学习者 哥哥/ })).toHaveAttribute(
      "href",
      "/admin/learner/older-brother"
    );
  });
});
