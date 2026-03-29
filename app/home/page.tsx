import PageCard from "@/components/page-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDefaultLearner } from "@/lib/data/learner";

export default async function HomePage() {
  await requireServerRole("learner");
  const learner = getDefaultLearner();
  const todayTaskCount = learner.dailyPlan.length;
  const focusCount = learner.focus.length;
  const nextTask = learner.dailyPlan[0];

  return (
    <PlaceholderPage
      role="learner"
      title={learner.name}
      description={`${learner.stage} • ${learner.track} • Reference Level ${learner.referenceLevel}`}
      currentPath="/home"
      sections={[
        {
          title: "Learning snapshot",
          content: (
            <div className="space-y-4">
              <div className="rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#23402b_0%,#4d6842_62%,#738b65_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(255,250,243,0.72)]">
                  Today&apos;s lead block
                </p>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {nextTask?.title ?? "Stay in rhythm today"}
                    </p>
                    <p className="mt-2 text-sm text-[rgba(255,250,243,0.84)] md:text-base">
                      {nextTask?.detail ??
                        "Keep the cycle light, consistent, and focused on one measurable lift."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/practice"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand-strong)] shadow-[0_14px_28px_rgba(18,34,22,0.18)] transition hover:bg-white"
                    >
                      Start practice
                    </a>
                    <a
                      href="/progress"
                      className="inline-flex items-center justify-center rounded-full border border-[rgba(255,250,243,0.3)] bg-[rgba(255,250,243,0.1)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,250,243,0.18)]"
                    >
                      Review progress
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Stage</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learner.stage}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{learner.track}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Today</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{todayTaskCount} tasks</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">One warm-up and one timed set.</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Focus</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{focusCount} priorities</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Keep the next cycle narrow and repeatable.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Daily Plan",
          content: (
            <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {learner.dailyPlan.map((task) => (
                <li key={task.title} className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Task</p>
                  <p className="mt-2 font-medium text-[var(--foreground)]">{task.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{task.detail}</p>
                </li>
              ))}
            </ul>
          )
        },
        {
          title: "Current focus",
          content: (
            <div className="grid gap-2 md:grid-cols-2">
              {learner.focus.map((item) => (
                <PageCard key={item} title={item}>
                  <p>Keep this skill inside the next daily cycle.</p>
                </PageCard>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
