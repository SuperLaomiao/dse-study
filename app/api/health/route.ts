import { getDatabaseAdminStatus } from "@/lib/database-admin";

export async function GET() {
  const database = await getDatabaseAdminStatus();

  return Response.json({
    ok: database.connectivity !== "unreachable",
    app: "dse-study",
    database
  });
}
