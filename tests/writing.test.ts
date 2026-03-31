import { describe, it, expect, vi } from "vitest";

// Stub environment before importing any modules that use env validation
vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost/db");
vi.stubEnv("NODE_ENV", "test");

// Dynamic import after stubbing
const { getDemoWritingPrompts, getDemoWritingPrompt } = await import("@/lib/data/writing");
const { getDemoGradingResult } = await import("@/lib/services/writing-grading");

describe("writing data", () => {
  it("should return an expanded set of seeded writing prompts", () => {
    const prompts = getDemoWritingPrompts();
    expect(prompts).toHaveLength(8);
  });

  it("should have 5 part1 prompts and 3 part2 prompts", () => {
    const prompts = getDemoWritingPrompts();
    const part1 = prompts.filter(p => p.part === "part1");
    const part2 = prompts.filter(p => p.part === "part2");
    expect(part1).toHaveLength(5);
    expect(part2).toHaveLength(3);
  });

  it("includes the curated dse-enhancer prompts in the local seed set", () => {
    const titles = getDemoWritingPrompts().map((prompt) => prompt.title);
    expect(titles).toContain("Formal Complaint Letter to Building Management");
    expect(titles).toContain("Speech for English Week");
    expect(titles).toContain("Report on an Elderly Centre Visit");
  });

  it("each prompt should have required fields", () => {
    const prompts = getDemoWritingPrompts();
    prompts.forEach(prompt => {
      expect(prompt.id).toBeDefined();
      expect(prompt.title).toBeDefined();
      expect(prompt.content).toBeDefined();
      expect(prompt.part).toBeDefined();
      expect(prompt.difficultyLevel).toBeDefined();
      expect(prompt.wordCountMin).toBeDefined();
      expect(prompt.wordCountMax).toBeDefined();
    });
  });

  it("should get prompt by id", () => {
    const prompt = getDemoWritingPrompt("demo-1");
    expect(prompt).not.toBeNull();
    expect(prompt?.id).toBe("demo-1");
    expect(prompt?.part).toBe("part1");
  });

  it("should return null for non-existent prompt", () => {
    const prompt = getDemoWritingPrompt("non-existent");
    expect(prompt).toBeNull();
  });
});

describe("writing grading", () => {
  it("should return a valid demo grading result", () => {
    const result = getDemoGradingResult("test essay");
    expect(result.overallScore).toBeDefined();
    expect(result.starRating).toBeDefined();
    expect(result.vocabulary).toBeDefined();
    expect(result.grammar).toBeDefined();
    expect(result.structure).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.suggestions).toBeDefined();
    expect(result.corrections).toBeDefined();
    expect(Array.isArray(result.corrections)).toBe(true);
  });

  it("overall score should be between 1 and 5", () => {
    const result = getDemoGradingResult("test essay");
    expect(result.overallScore).toBeGreaterThanOrEqual(1);
    expect(result.overallScore).toBeLessThanOrEqual(5);
  });

  it("star rating should be * or **", () => {
    const result = getDemoGradingResult("test essay");
    expect(["*", "**"]).toContain(result.starRating);
  });
});
