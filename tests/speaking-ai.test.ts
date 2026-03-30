import { describe, expect, it } from "vitest";

import {
  buildSpeakingEvaluationPrompt,
  getSpeakingModeConfig,
  getSpeakingModes
} from "@/lib/speaking-ai";

describe("speaking ai helpers", () => {
  it("exposes both speaking modes with stable labels", () => {
    expect(getSpeakingModes()).toEqual(["pattern", "exam"]);
    expect(getSpeakingModeConfig("pattern").label).toBe("Pattern mode");
    expect(getSpeakingModeConfig("exam").label).toBe("Exam mode");
    expect(getSpeakingModeConfig("pattern", "zh").label).toBe("模式练习");
    expect(getSpeakingModeConfig("exam", "zh").label).toBe("考试模拟");
  });

  it("builds an evaluator prompt that includes task context and transcript", () => {
    const prompt = buildSpeakingEvaluationPrompt({
      mode: "exam",
      promptText: "Should students join more clubs at school?",
      transcript: "I think yes because it builds confidence and social skills."
    });

    expect(prompt).toContain("Should students join more clubs at school?");
    expect(prompt).toContain("I think yes because it builds confidence and social skills.");
    expect(prompt).toContain("parent summary");
    expect(prompt).toContain("DSE");
  });
});
