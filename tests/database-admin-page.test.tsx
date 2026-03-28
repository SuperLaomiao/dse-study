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
    summary: "CloudBase MySQL is reachable and seeded.",
    nextStep: "Database is ready for the learner and admin flows.",
    issueCode: "none",
    detail: "CloudBase runtime can query the shared MySQL instance."
  }))
}));

import AdminSystemPage from "@/app/admin/system/page";

describe("database admin page", () => {
  it("renders database status and controls", async () => {
    render(await AdminSystemPage());

    expect(screen.getByRole("heading", { name: "Database Ops" })).toBeInTheDocument();
    expect(screen.getByText("CloudBase MySQL is reachable and seeded.")).toBeInTheDocument();
    expect(screen.getByText("Database is ready for the learner and admin flows.")).toBeInTheDocument();
    expect(screen.getByText("CloudBase runtime can query the shared MySQL instance.")).toBeInTheDocument();
    expect(screen.getByText("Connectivity")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Issue")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bootstrap Schema" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seed Demo Data" })).toBeInTheDocument();
  });
});
