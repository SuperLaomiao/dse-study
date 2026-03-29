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
          title: "Action desk",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(135deg,rgba(248,243,234,0.96),rgba(234,244,231,0.9))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Start from the decision surface, then jump into the family dashboard or system
                checks without hunting through the nav.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/admin/family"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open Family Dashboard
                </a>
                <a
                  href="/admin/system"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/70 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Open System Checks
                </a>
              </div>
            </div>
          )
        },
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
