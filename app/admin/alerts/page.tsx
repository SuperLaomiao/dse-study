import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoAdminSnapshot } from "@/lib/data/admin";

export default async function AdminAlertsPage() {
  await requireServerRole("admin");
  const snapshot = getDemoAdminSnapshot();

  const urgentAlerts = snapshot.alerts.filter((alert) =>
    /due soon|overdue|missed/i.test(`${alert.title} ${alert.detail}`)
  );
  const upcomingAlerts = snapshot.alerts.filter((alert) => !urgentAlerts.includes(alert));

  return (
    <PlaceholderPage
      role="admin"
      title="Alerts"
      description="Summary-first reminders help Mom stay involved without overload."
      sections={[
        {
          title: "Current alerts",
          content: (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  Needs attention now
                </p>
                <ul className="mt-3 space-y-2">
                  {urgentAlerts.map((alert) => (
                    <li key={alert.title}>
                      <p className="font-medium text-[#1f2a1f]">{alert.title}</p>
                      <p className="text-sm text-[#435443]">{alert.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Upcoming</p>
                <ul className="mt-3 space-y-2">
                  {upcomingAlerts.map((alert) => (
                    <li key={alert.title}>
                      <p className="font-medium text-[#1f2a1f]">{alert.title}</p>
                      <p className="text-sm text-[#435443]">{alert.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
