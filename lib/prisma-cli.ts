import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runPrismaDbPush() {
  return execFileAsync(
    process.execPath,
    ["./node_modules/prisma/build/index.js", "db", "push", "--skip-generate", "--accept-data-loss"],
    {
      cwd: process.cwd(),
      env: process.env
    }
  );
}
