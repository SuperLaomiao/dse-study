import { render, screen } from "@testing-library/react";

import B1B2ReadinessPage from "@/app/dse/b1-b2/page";
import DseDashboardPage from "@/app/dse/page";
import LandingPage from "@/app/page";

describe("public and dse pages", () => {
  it("renders a more actionable public landing page", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { name: "DSE Study" })).toBeInTheDocument();
    expect(screen.getByText("Why families stay with it")).toBeInTheDocument();
    expect(screen.getByText("Daily momentum")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open sign in" })).toHaveAttribute("href", "/sign-in");
  });

  it("renders a richer dse dashboard page", () => {
    render(<DseDashboardPage />);

    expect(screen.getByRole("heading", { name: "DSE Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Exam lens")).toBeInTheDocument();
    expect(screen.getByText("Paper balance")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open B1/B2 readiness" })).toHaveAttribute(
      "href",
      "/dse/b1-b2"
    );
  });

  it("renders a clearer b1 b2 readiness page", () => {
    render(<B1B2ReadinessPage />);

    expect(screen.getByRole("heading", { name: "B1/B2 Readiness" })).toBeInTheDocument();
    expect(screen.getByText("Readiness status")).toBeInTheDocument();
    expect(screen.getByText("Reading under time")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open DSE dashboard" })).toHaveAttribute("href", "/dse");
  });
});
