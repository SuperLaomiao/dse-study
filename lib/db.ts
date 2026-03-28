export type DataAccessMode = "demo" | "database";

export function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() ?? "";
}

export function hasSupportedMysqlUrl(url: string) {
  return url.startsWith("mysql://") || url.startsWith("mysqls://");
}

export function getDataAccessMode(): DataAccessMode {
  const databaseUrl = getDatabaseUrl();
  return databaseUrl && hasSupportedMysqlUrl(databaseUrl) ? "database" : "demo";
}

export function getDatabaseConfigIssue() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return "missing";
  }

  if (!hasSupportedMysqlUrl(databaseUrl)) {
    return "unsupported";
  }

  return null;
}
