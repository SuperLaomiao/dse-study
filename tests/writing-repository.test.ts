import { describe, expect, it, vi } from "vitest";
import { getAllWritingPrompts, getDefaultLearnerLevel } from "@/lib/repositories/writing-repository";

describe("writing repository", () => {
  it("returns default learner level as 3", () => {
    const level = getDefaultLearnerLevel();
    expect(level).toBe(3);
  });

  it("returns empty array in demo mode", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const prompts = await getAllWritingPrompts();
    expect(prompts).toEqual([]);
    vi.unstubAllEnvs();
  });
});
