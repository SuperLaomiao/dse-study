import { describe, expect, it, vi } from "vitest";
import { getAllGrammarQuestions, getDefaultLearnerLevel } from "@/lib/repositories/grammar-repository";

describe("grammar repository", () => {
  it("returns default learner level as 3 (intermediate)", () => {
    const level = getDefaultLearnerLevel();
    expect(level).toBe(3);
  });

  it("returns empty array in demo mode", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const questions = await getAllGrammarQuestions();
    expect(questions).toEqual([]);
    vi.unstubAllEnvs();
  });
});
