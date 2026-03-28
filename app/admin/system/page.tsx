import DatabaseOpsCard from "@/components/admin/database-ops-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDatabaseAdminStatus } from "@/lib/database-admin";

export default async function AdminSystemPage() {
  await requireServerRole("admin");
  const status = await getDatabaseAdminStatus();

  return (
    <PlaceholderPage
      role="admin"
      title="Database Ops"
      description="Use this admin-only workspace to verify CloudBase MySQL and initialize the schema safely."
      sections={[
        {
          title: "CloudBase MySQL",
          content: <DatabaseOpsCard status={status} />
        }
      ]}
    />
  );
}
