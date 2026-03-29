import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getAdminLearnerDetailById } from "@/lib/repositories/profile-repository";

export default async function AdminLearnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireServerRole("admin");
  const { id } = await params;
  const learner = await getAdminLearnerDetailById(id);

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
