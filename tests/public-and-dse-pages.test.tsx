import { render, screen } from "@testing-library/react";

import B1B2ReadinessPage from "@/app/dse/b1-b2/page";
import DseDashboardPage from "@/app/dse/page";
import LandingPage from "@/app/page";

describe("public and dse pages", () => {
  it("renders a more actionable public landing page", async () => {
    render(await LandingPage());

    expect(screen.getByRole("heading", { name: "DSE 学习" })).toBeInTheDocument();
    expect(screen.getByText("为什么家庭能坚持下去")).toBeInTheDocument();
    expect(screen.getByText("每日节奏")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开登录页" })).toHaveAttribute("href", "/sign-in");
  });

  it("renders a richer dse dashboard page", async () => {
    render(await DseDashboardPage());

    expect(screen.getByRole("heading", { name: "DSE 看板" })).toBeInTheDocument();
    expect(screen.getByText("考试视角")).toBeInTheDocument();
    expect(screen.getByText("卷别平衡")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开 B1/B2 就绪度" })).toHaveAttribute(
      "href",
      "/dse/b1-b2"
    );
  });

  it("renders a clearer b1 b2 readiness page", async () => {
    render(await B1B2ReadinessPage());

    expect(screen.getByRole("heading", { name: "B1/B2 就绪度" })).toBeInTheDocument();
    expect(screen.getByText("就绪状态")).toBeInTheDocument();
    expect(screen.getByText("限时阅读")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开 DSE 看板" })).toHaveAttribute("href", "/dse");
  });
});
