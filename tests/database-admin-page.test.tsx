import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/auth/server", () => ({
  requireServerRole: vi.fn(async () => ({ userId: "mom-admin", role: "admin" }))
}));

vi.mock("@/lib/database-admin", () => ({
  getDatabaseAdminStatus: vi.fn(async () => ({
    mode: "database",
    connectivity: "connected",
    schemaReady: true,
    seeded: true,
    summary: "Neon Postgres is reachable and seeded.",
    nextStep: "Database is ready for the learner and admin flows.",
    issueCode: "none",
    detail: "The runtime can query the shared Neon Postgres instance."
  }))
}));

import AdminSystemPage from "@/app/admin/system/page";

describe("database admin page", () => {
  it("renders database status and controls", async () => {
    render(await AdminSystemPage());

    expect(screen.getByRole("heading", { name: "数据库运维" })).toBeInTheDocument();
    expect(screen.getByText("Neon Postgres is reachable and seeded.")).toBeInTheDocument();
    expect(screen.getByText("Database is ready for the learner and admin flows.")).toBeInTheDocument();
    expect(screen.getByText("The runtime can query the shared Neon Postgres instance.")).toBeInTheDocument();
    expect(screen.getByText("连通性")).toBeInTheDocument();
    expect(screen.getByText("已连接")).toBeInTheDocument();
    expect(screen.getByText("问题")).toBeInTheDocument();
    expect(screen.getByText("无")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开家庭看板" })).toHaveAttribute(
      "href",
      "/admin/family"
    );
    expect(screen.getByRole("link", { name: "打开提醒看板" })).toHaveAttribute(
      "href",
      "/admin/alerts"
    );
    expect(screen.getByRole("button", { name: "初始化 Schema" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "写入演示数据" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开健康检查" })).toHaveAttribute(
      "href",
      "/api/health"
    );
    expect(screen.getByText("执行顺序")).toBeInTheDocument();
    expect(screen.getByText("1. 改 schema 之前，先确认健康检查与数据库连通性。")).toBeInTheDocument();
  });
});
