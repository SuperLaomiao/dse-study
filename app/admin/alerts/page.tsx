import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoAdminSnapshot } from "@/lib/data/admin";

export default async function AdminAlertsPage() {
  await requireServerRole("admin");
  const snapshot = getDemoAdminSnapshot();

  return (
    <PlaceholderPage
      role="admin"
      title="Alerts"
      description="Summary-first reminders help Mom stay involved without overload."
      sections={[
        {
          title: "Current alerts",
          content: (
            <ul className="space-y-2">
              {snapshot.alerts.map((alert) => (
                <li key={alert.title}>
                  <p className="font-medium text-[#1f2a1f]">{alert.title}</p>
                  <p>{alert.detail}</p>
                </li>
              ))}
            </ul>
          )
        }
      ]}
    />
  );
}
