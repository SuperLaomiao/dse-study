export type DataAccessMode = "demo" | "database";

export function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() ?? "";
}

export function hasSupportedDatabaseUrl(url: string) {
  return (
    url.startsWith("postgresql://") ||
    url.startsWith("postgres://") ||
    url.startsWith("mysql://") ||
    url.startsWith("mysqls://")
  );
}

export function getDataAccessMode(): DataAccessMode {
  const databaseUrl = getDatabaseUrl();
  return databaseUrl && hasSupportedDatabaseUrl(databaseUrl) ? "database" : "demo";
}

export function getDatabaseConfigIssue() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return "missing";
  }

  if (!hasSupportedDatabaseUrl(databaseUrl)) {
    return "unsupported";
  }

  return null;
}
