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
  if (path === "/api/health") {
    const healthFailure = getHealthFailure(body);

    if (healthFailure) {
      return healthFailure;
    }
  }

  const matched = expectAnyText.some((text) => body.includes(text));

  if (matched) {
    return null;
  }

  return `${path} did not include any expected text: ${expectAnyText.join(" | ")}`;
}

function getHealthFailure(body: string) {
  try {
    const payload = JSON.parse(body) as {
      ok?: boolean;
      database?: { issueCode?: string; summary?: string };
    };

    if (payload.ok !== false) {
      return null;
    }

    const issueCode = payload.database?.issueCode ?? "unknown";
    const summary = payload.database?.summary ?? "No database summary returned.";

    return `/api/health reported ok=false (issueCode=${issueCode}): ${summary}`;
  } catch {
    return null;
  }
}
