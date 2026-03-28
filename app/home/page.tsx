import PageCard from "@/components/page-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDefaultLearner } from "@/lib/data/learner";

export default async function HomePage() {
  await requireServerRole("learner");
  const learner = getDefaultLearner();
  const todayTaskCount = learner.dailyPlan.length;
  const focusCount = learner.focus.length;

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
                <p className="mt-1 text-sm text-[#435443]">Keep the next cycle narrow and repeatable.</p>
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
