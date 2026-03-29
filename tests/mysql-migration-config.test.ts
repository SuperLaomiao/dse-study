import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const rootDir = process.cwd();

describe("Vercel Neon config", () => {
  it("uses postgresql as the Prisma datasource provider", () => {
    const schema = readFileSync(join(rootDir, "prisma/schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
  });

  it("documents Neon Postgres in the README deployment guidance", () => {
    const readme = readFileSync(join(rootDir, "README.md"), "utf8");

    expect(readme).toContain("Vercel + Neon");
    expect(readme).toContain("postgresql://");
  });
});
