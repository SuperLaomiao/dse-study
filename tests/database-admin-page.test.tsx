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
    summary: "CloudBase MySQL is reachable and seeded."
  }))
}));

import AdminSystemPage from "@/app/admin/system/page";

describe("database admin page", () => {
  it("renders database status and controls", async () => {
    render(await AdminSystemPage());

    expect(screen.getByRole("heading", { name: "Database Ops" })).toBeInTheDocument();
    expect(screen.getByText("CloudBase MySQL is reachable and seeded.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bootstrap Schema" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seed Demo Data" })).toBeInTheDocument();
  });
});
