import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("health check API", () => {
  it("should create health check endpoint file", () => {
    const filePath = path.join(__dirname, "../app/api/health/route.ts");
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toContain("mode");
    expect(content).toContain("database");
    expect(content).toContain("environment");
    expect(content).toContain("hasOpenAIKey");
  });
});
