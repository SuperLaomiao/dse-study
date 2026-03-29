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
      description="Use this admin-only workspace to verify Neon Postgres on Vercel and initialize the schema safely."
      sections={[
        {
          title: "Control room",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(78,113,68,0.9))] p-5 text-[#f8f5ed]">
              <p className="max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.8)]">
                Use this page as the operational checkpoint for data health, then jump back into
                the family dashboard or alerts if the app itself needs attention.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/admin/family"
                  className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                >
                  Open Family Dashboard
                </a>
                <a
                  href="/admin/alerts"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.24)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                >
                  Open Alerts Board
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Neon Postgres",
          content: <DatabaseOpsCard status={status} />
        }
      ]}
    />
  );
}
