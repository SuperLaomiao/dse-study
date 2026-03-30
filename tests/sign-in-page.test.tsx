import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  redirectIfSignedIn: vi.fn(async () => undefined)
}));

import SignInPage from "@/app/sign-in/page";

describe("sign-in page", () => {
  it("renders a route error message from search params", async () => {
    render(
      await SignInPage({
        searchParams: Promise.resolve({
          error: "Email is required."
        })
      })
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  it("renders clear next-step links for new families and invited learners", async () => {
    render(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByText("选择进入演示或 onboarding 流程的最快路径。")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /创建家庭/i })).toHaveAttribute(
      "href",
      "/family/create"
    );
    expect(screen.getByRole("link", { name: /加入家庭/i })).toHaveAttribute(
      "href",
      "/family/join"
    );
    expect(screen.getByRole("link", { name: /预览学习者首页/i })).toHaveAttribute(
      "href",
      "/home"
    );
    expect(screen.getByLabelText("密码")).toHaveAttribute("type", "password");
  });
});
