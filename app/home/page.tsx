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
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.1)] bg-[linear-gradient(135deg,rgba(35,64,43,0.96),rgba(73,107,64,0.88))] p-5 text-[#f8f5ed]">
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(248,245,237,0.72)]">
                  Today&apos;s lead block
                </p>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                      {nextTask?.title ?? "Stay in rhythm today"}
                    </p>
                    <p className="mt-2 text-sm text-[rgba(248,245,237,0.8)] md:text-base">
                      {nextTask?.detail ??
                        "Keep the cycle light, consistent, and focused on one measurable lift."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/practice"
                      className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                    >
                      Start practice
                    </a>
                    <a
                      href="/progress"
                      className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.3)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                    >
                      Review progress
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Stage</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.stage}</p>
                  <p className="mt-1 text-sm text-[#435443]">{learner.track}</p>
                </div>
                <div className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Today</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{todayTaskCount} tasks</p>
                  <p className="mt-1 text-sm text-[#435443]">One warm-up and one timed set.</p>
                </div>
                <div className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Focus</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{focusCount} priorities</p>
                  <p className="mt-1 text-sm text-[#435443]">
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
                <li key={task.title} className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Task</p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#435443]">{task.detail}</p>
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
