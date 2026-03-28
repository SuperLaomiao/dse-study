import PageCard from "@/components/page-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDefaultLearner } from "@/lib/data/learner";

export default async function HomePage() {
  await requireServerRole("learner");
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title={learner.name}
      description={`${learner.stage} • ${learner.track} • Reference Level ${learner.referenceLevel}`}
      currentPath="/home"
      sections={[
        {
          title: "Daily Plan",
          content: (
            <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {learner.dailyPlan.map((task) => (
                <li key={task.title} className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-3">
                  <p className="font-medium text-[#1f2a1f]">{task.title}</p>
                  <p>{task.detail}</p>
                </li>
              ))}
            </ul>
          )
        },
        {
          title: "Current Focus",
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
