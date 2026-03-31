import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("environment validation", () => {
  it("should create env validation file correctly", () => {
    const filePath = path.join(__dirname, "../lib/env.ts");
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toContain("z.object");
    expect(content).toContain("DATABASE_URL");
    expect(content).toContain("OPENAI_API_KEY");
  });
});
