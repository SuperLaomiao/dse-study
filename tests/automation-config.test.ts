import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const rootDir = process.cwd();

describe("automation config", () => {
  it("adds a smoke-check script to package.json", () => {
    const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));

    expect(packageJson.scripts["smoke:deployment"]).toBeDefined();
    expect(packageJson.scripts.ci).toBeDefined();
  });

  it("adds a GitHub Actions CI workflow", () => {
    const workflowPath = join(rootDir, ".github/workflows/ci.yml");

    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run prisma:generate");
    expect(workflow).toContain("npm run test -- --run");
    expect(workflow).toContain("npm run lint");
    expect(workflow).toContain("npm run build");
  });

  it("adds a deployment smoke workflow", () => {
    const workflowPath = join(rootDir, ".github/workflows/smoke-deployment.yml");

    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("SMOKE_BASE_URL");
    expect(workflow).toContain("npm run smoke:deployment");
    expect(workflow).toContain("workflow_run");
  });
});
