export type DataAccessMode = "demo" | "database";

export function getDataAccessMode(): DataAccessMode {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  return databaseUrl ? "database" : "demo";
}
