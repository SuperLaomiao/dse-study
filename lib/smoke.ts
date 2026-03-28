export interface SmokeTarget {
  path: string;
  expectAnyText: string[];
}

export function getCloudbaseSmokeTargets(): SmokeTarget[] {
  return [
    { path: "/api/health", expectAnyText: ['"app":"dse-study"', '"database"'] },
    { path: "/", expectAnyText: ["DSE Study"] },
    { path: "/sign-in", expectAnyText: ["Sign In"] },
    { path: "/admin/family", expectAnyText: ["Family Overview", "Sign In"] },
    { path: "/admin/system", expectAnyText: ["Database Ops", "Sign In"] }
  ];
}

export function getSmokeFailure(path: string, body: string, expectAnyText: string[]) {
  const matched = expectAnyText.some((text) => body.includes(text));

  if (matched) {
    return null;
  }

  return `${path} did not include any expected text: ${expectAnyText.join(" | ")}`;
}
