import { describe, it, expect } from "vitest";
import { calculateStreakDays } from "@/lib/repositories/progress-repository";

describe("calculateStreakDays", () => {
  it("should return 0 for empty list", () => {
    expect(calculateStreakDays([])).toBe(0);
  });

  it("should return 1 when practiced today", () => {
    const today = new Date();
    expect(calculateStreakDays([today])).toBe(1);
  });

  it("should return 3 for 3 consecutive days including today", () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(calculateStreakDays([today, yesterday, twoDaysAgo])).toBe(3);
  });

  it("should return 0 if no practice today", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(calculateStreakDays([yesterday])).toBe(0);
  });
});
