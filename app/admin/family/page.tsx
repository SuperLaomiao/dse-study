import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";

export default async function AdminFamilyPage() {
  await requireServerRole("admin");
  const { snapshot, family, learners } = await getFamilyDashboardData();
  const activePlans = learners.reduce((total, learner) => total + learner.dailyPlan.length, 0);
  const activeAlerts = snapshot.alerts.length;
  const nextLearner = learners[0];

  return (
    <PlaceholderPage
      role="admin"
      title={snapshot.familyLabel}
      description={`${family.familyName} managed by ${snapshot.adminName}`}
      sections={[
        {
          title: "Action desk",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.1)] bg-[linear-gradient(145deg,rgba(252,247,239,0.98),rgba(229,239,229,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Stay on the family surface for learner-by-learner checks, then jump straight into
                alerts or system status when something needs intervention.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/admin/alerts"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                >
                  Open Alerts Board
                </a>
                <a
                  href="/admin/system"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                >
                  Open System Checks
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Decision board",
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  Active alerts
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{activeAlerts}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Keep the family view as the decision surface, then jump into the learner that
                  needs attention first.
                </p>
                {nextLearner ? (
                  <a
                    href={`/admin/learner/${nextLearner.id}`}
                    className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {`Open ${nextLearner.name} first`}
                  </a>
                ) : null}
              </div>
              <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Next checks</p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                  <p>1. Review the newest learner alert and check their queue.</p>
                  <p>2. Open system status only if the health signal or schema setup looks off.</p>
                  <p>3. Return to alerts when you need a family-wide reminder list.</p>
                </div>
                <a
                  href="/api/health"
                  className="mt-4 inline-flex rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                >
                  Open Health Check
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Household snapshot",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Family</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{family.familyName}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Managed by</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{snapshot.adminName}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Learners</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learners.length}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Active learner profiles in the family.</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Plans</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{activePlans}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Daily tasks currently lined up.</p>
              </div>
            </div>
          )
        },
        {
          title: "Family summary",
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {learners.map((learner) => (
                <article
                  key={learner.id}
                  className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{learner.stage}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learner.name}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {learner.track} • {learner.referenceLevel} • {learner.internalBand}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Focus</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {learner.focus.map((focusItem) => (
                        <li
                          key={focusItem}
                          className="rounded-full border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.92)] px-3 py-1 text-xs font-medium text-[var(--brand)]"
                        >
                          {focusItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`/admin/learner/${learner.id}`}
                    className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                  >
                    Open {learner.name}
                  </a>
                </article>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
