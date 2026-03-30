import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ token: "demo-token" }),
  useRouter: () => ({ push })
}));

describe("join invite page", () => {
  beforeEach(() => {
    push.mockReset();
    document.documentElement.lang = "zh-HK";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders chinese copy when the document locale is chinese", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "learner@example.com",
        role: "learner",
        familyName: "陳家",
        inviterName: "媽媽管理員",
        expiresAt: "2026-04-05T00:00:00.000Z",
        isValid: true,
        isExpired: false,
        isAccepted: false
      })
    } as Response);

    const { default: JoinInvitePage } = await import("@/app/join/[token]/page");
    render(<JoinInvitePage />);

    expect(await screen.findByRole("heading", { name: "加入家庭" })).toBeInTheDocument();
    expect(screen.getByText("你被邀请加入 陳家")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "接受邀请" })).toBeInTheDocument();
  });

  it("renders english copy when the document locale is english", async () => {
    document.documentElement.lang = "en";

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "learner@example.com",
        role: "learner",
        familyName: "Chan Family",
        inviterName: "Mom Admin",
        expiresAt: "2026-04-05T00:00:00.000Z",
        isValid: true,
        isExpired: false,
        isAccepted: false
      })
    } as Response);

    const { default: JoinInvitePage } = await import("@/app/join/[token]/page");
    render(<JoinInvitePage />);

    expect(await screen.findByRole("heading", { name: "Join Family" })).toBeInTheDocument();
    expect(screen.getByText("You've been invited to join Chan Family")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept Invite" })).toBeInTheDocument();
  });
});
