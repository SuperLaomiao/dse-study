import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoAdminSnapshot } from "@/lib/data/admin";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";
import { getAdminLearnerDetailById } from "@/lib/repositories/profile-repository";

export default async function AdminLearnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireServerRole("admin");
  const { id } = await params;
  const { learners } = await getFamilyDashboardData();
  const learner = await getAdminLearnerDetailById(id);
  const learnerAlerts = getDemoAdminSnapshot().alerts.filter((alert) =>
    `${alert.title} ${alert.detail}`.toLowerCase().includes(id.replace("-", " "))
  );

  if (!learner) {
    return (
      <PlaceholderPage
        role="admin"
        title="Learner not found"
        description="The requested learner record is missing from the current demo dataset."
        sections={[
          {
            title: "Next step",
            content: <a href="/admin/family">Back to Family Overview</a>
          }
        ]}
      />
    );
  }

  const currentLearnerIndex = learners.findIndex((member) => member.id === learner.id);
  const nextLearner =
    currentLearnerIndex >= 0 && currentLearnerIndex < learners.length - 1
      ? learners[currentLearnerIndex + 1]
      : null;

  return (
    <PlaceholderPage
      role="admin"
      title={learner.name}
      description={`${learner.stage} • ${learner.track}`}
      sections={[
        {
          title: "Study cadence",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <MetricCard label="Time" value={`${learner.studyMinutesPerDay} min/day`} />
              <MetricCard label="Rhythm" value={`${learner.studyDaysPerWeek} days/week`} />
              <MetricCard label="Level" value={`${learner.referenceLevel} now`} />
            </div>
          )
        },
        {
          title: "Target trajectory",
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Current reference</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.referenceLevel}</p>
                <p className="mt-1 text-sm text-[#435443]">Working steadily toward the next band jump.</p>
              </article>
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Internal target</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.internalBand}</p>
                <p className="mt-1 text-sm text-[#435443]">Use this target to calibrate task difficulty and review load.</p>
              </article>
            </div>
          )
        },
        {
          title: "Current focus",
          content: (
            <ul className="grid gap-2 md:grid-cols-2">
              {learner.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-[18px] bg-[rgba(246,241,231,0.62)] px-4 py-3 text-sm font-medium text-[#314531]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )
        },
        {
          title: "Linked alerts",
          content: (
            <div className="space-y-3">
              {learnerAlerts.length > 0 ? (
                learnerAlerts.map((alert) => (
                  <article
                    key={`${learner.id}-${alert.title}`}
                    className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(246,241,231,0.72)] p-4"
                  >
                    <p className="font-semibold text-[#1f2a1f]">{alert.title}</p>
                    <p className="mt-1 text-sm text-[#435443]">{alert.detail}</p>
                  </article>
                ))
              ) : (
                <article className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="font-semibold text-[#1f2a1f]">No active alerts</p>
                  <p className="mt-1 text-sm text-[#435443]">
                    Stay on the current plan and keep watching the next review cycle.
                  </p>
                </article>
              )}
            </div>
          )
        },
        {
          title: "Today's queue",
          content: (
            <div className="space-y-3">
              {learner.dailyPlan.map((task) => (
                <article
                  key={task.title}
                  className="rounded-[22px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,255,255,0.78)] p-4"
                >
                  <p className="font-semibold text-[#1f2a1f]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#435443]">{task.detail}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          title: "Quick actions",
          content: (
            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/family"
                className="inline-flex rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea]"
              >
                Back to Family Overview
              </a>
              <a
                href="/admin/system"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                Open System
              </a>
              <a
                href="/practice"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                Open practice hub
              </a>
              <a
                href="/progress"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                Open progress
              </a>
              <a
                href="/admin/alerts"
                className="inline-flex rounded-full bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                Open alerts board
              </a>
              {nextLearner ? (
                <a
                  href={`/admin/learner/${nextLearner.id}`}
                  className="inline-flex rounded-full border border-[rgba(35,64,43,0.12)] bg-[rgba(246,241,231,0.82)] px-4 py-2 text-sm font-semibold text-[#23402b]"
                >
                  {`Next learner: ${nextLearner.name}`}
                </a>
              ) : null}
            </div>
          )
        }
      ]}
    />
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[24px] bg-[rgba(246,241,231,0.7)] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{value}</p>
    </article>
  );
}
