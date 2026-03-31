import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("grammar API routes", () => {
  it("should have GET /api/grammar/questions endpoint file", () => {
    const filePath = path.join(__dirname, "../app/api/grammar/questions/route.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have GET /api/grammar/question/[id] endpoint file", () => {
    const filePath = path.join(__dirname, "../app/api/grammar/question/[id]/route.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have POST /api/grammar/submit endpoint file", () => {
    const filePath = path.join(__dirname, "../app/api/grammar/submit/route.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
