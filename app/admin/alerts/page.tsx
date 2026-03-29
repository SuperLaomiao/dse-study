import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoAdminSnapshot } from "@/lib/data/admin";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";

export default async function AdminAlertsPage() {
  await requireServerRole("admin");
  const snapshot = getDemoAdminSnapshot();
  const { learners } = await getFamilyDashboardData();

  const urgentAlerts = snapshot.alerts.filter((alert) =>
    /due soon|overdue|missed/i.test(`${alert.title} ${alert.detail}`)
  );
  const upcomingAlerts = snapshot.alerts.filter((alert) => !urgentAlerts.includes(alert));
  const learnerAlertLanes = learners.map((learner) => ({
    learner,
    alerts: snapshot.alerts.filter((alert) =>
      `${alert.title} ${alert.detail}`.toLowerCase().includes(learner.name.toLowerCase())
    )
  }));

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
                <a
                  href="/api/health"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/70 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Open Health Check
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
        },
        {
          title: "Decision lanes",
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {learnerAlertLanes.map(({ learner, alerts }) => (
                <article
                  key={learner.id}
                  className="rounded-[24px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,255,255,0.82)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">
                        {learner.stage}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.name}</p>
                      <p className="mt-1 text-sm text-[#435443]">
                        {alerts.length > 0
                          ? `${alerts.length} current alert${alerts.length > 1 ? "s" : ""}`
                          : "No immediate alerts, keep the usual rhythm."}
                      </p>
                    </div>
                    <a
                      href={`/admin/learner/${learner.id}`}
                      className="inline-flex rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea]"
                    >
                      {`Open learner detail: ${learner.name}`}
                    </a>
                  </div>
                  <div className="mt-4 space-y-2">
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <div
                          key={`${learner.id}-${alert.title}`}
                          className="rounded-[18px] bg-[rgba(246,241,231,0.72)] px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-[#1f2a1f]">{alert.title}</p>
                          <p className="mt-1 text-sm text-[#435443]">{alert.detail}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] bg-[rgba(246,241,231,0.72)] px-4 py-3">
                        <p className="text-sm font-semibold text-[#1f2a1f]">Stable lane</p>
                        <p className="mt-1 text-sm text-[#435443]">
                          Keep an eye on the next review cycle and leave the current plan untouched.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
