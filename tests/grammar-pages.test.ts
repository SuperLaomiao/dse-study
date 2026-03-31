import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("grammar pages", () => {
  it("should have grammar practice list page", () => {
    const filePath = path.join(__dirname, "../app/grammar/practice/page.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have grammar question practice page", () => {
    const filePath = path.join(__dirname, "../app/grammar/[id]/practice/page.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have grammar practice result page", () => {
    const filePath = path.join(__dirname, "../app/grammar/[id]/result/page.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
