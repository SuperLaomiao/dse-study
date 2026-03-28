import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const rootDir = process.cwd();

describe("CloudBase MySQL migration config", () => {
  it("uses mysql as the Prisma datasource provider", () => {
    const schema = readFileSync(join(rootDir, "prisma/schema.prisma"), "utf8");

    expect(schema).toContain('provider = "mysql"');
  });

  it("documents CloudBase MySQL in deployment guidance", () => {
    const deployNotes = readFileSync(join(rootDir, "cloudbase-deploy.md"), "utf8");

    expect(deployNotes).toContain("CloudBase MySQL");
    expect(deployNotes).toContain("mysql://");
  });
});
