import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "older-brother", role: "learner" }))
}));

import FamilyCreatePage from "@/app/family/create/page";
import FamilyJoinPage from "@/app/family/join/page";
import OnboardingProfilePage from "@/app/onboarding/profile/page";

describe("account entry pages", () => {
  it("renders a more guided family create page", async () => {
    render(await FamilyCreatePage());

    expect(screen.getByRole("heading", { name: "创建家庭" })).toBeInTheDocument();
    expect(screen.getAllByText("第 1 步（共 3 步）")).toHaveLength(2);
    expect(screen.getByText("会创建什么")).toBeInTheDocument();
    expect(screen.getByText("家长控制席位")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "创建家庭" })).toBeInTheDocument();
    expect(screen.getByLabelText("邮箱")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("密码")).toHaveAttribute("type", "password");
    expect(screen.getByPlaceholderText("例如：陈家")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如：妈妈管理员")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请设置密码")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "下一步去学习者加入" })).toHaveAttribute(
      "href",
      "/family/join"
    );
    expect(screen.getAllByRole("link", { name: "返回登录" })[0]).toHaveAttribute(
      "href",
      "/sign-in"
    );
    expect(screen.getByRole("link", { name: "已经有邀请码？" })).toHaveAttribute(
      "href",
      "/family/join"
    );
  });

  it("renders a more guided family join page", async () => {
    render(await FamilyJoinPage());

    expect(screen.getByRole("heading", { name: "加入家庭" })).toBeInTheDocument();
    expect(screen.getAllByText("第 2 步（共 3 步）")).toHaveLength(2);
    expect(screen.getByText("你需要准备什么")).toBeInTheDocument();
    expect(screen.getByText("演示邀请码")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "加入家庭" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如：CHAN-FAMILY")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "继续到学习者档案" })).toHaveAttribute(
      "href",
      "/onboarding/profile"
    );
    expect(screen.getAllByRole("link", { name: "返回登录" })[0]).toHaveAttribute(
      "href",
      "/sign-in"
    );
    expect(screen.getByRole("link", { name: "要先创建家庭吗？" })).toHaveAttribute(
      "href",
      "/family/create"
    );
  });

  it("renders a richer onboarding profile page", async () => {
    render(await OnboardingProfilePage());

    expect(screen.getByRole("heading", { name: "学习者档案" })).toBeInTheDocument();
    expect(screen.getAllByText("第 3 步（共 3 步）")).toHaveLength(2);
    expect(screen.getByText("档案设置")).toBeInTheDocument();
    expect(screen.getByText("为什么这份档案很重要")).toBeInTheDocument();
    expect(screen.getByText("每日容量")).toBeInTheDocument();
    expect(screen.getByText("完成交接")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DSE 主轨" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "基础衔接 DSE" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "陪伴模式" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "小五" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "中三" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "成人" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "其他" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回学习页" })).toHaveAttribute("href", "/learn");
    expect(screen.getByRole("link", { name: "打开登录页" })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("button", { name: "保存档案" })).toBeInTheDocument();
  });
});
