import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";

export default async function AdminFamilyPage() {
  await requireServerRole("admin");
  const { snapshot, family, learners } = await getFamilyDashboardData();
  const activePlans = learners.reduce((total, learner) => total + learner.dailyPlan.length, 0);

  return (
    <PlaceholderPage
      role="admin"
      title={snapshot.familyLabel}
      description={`${family.familyName} managed by ${snapshot.adminName}`}
      sections={[
        {
          title: "Household snapshot",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.78)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Family</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{family.familyName}</p>
                <p className="mt-1 text-sm text-[#435443]">Managed by</p>
                <p className="text-sm font-medium text-[#1f2a1f]">{snapshot.adminName}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.78)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Learners</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learners.length}</p>
                <p className="mt-1 text-sm text-[#435443]">Active learner profiles in the family.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.78)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Plans</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{activePlans}</p>
                <p className="mt-1 text-sm text-[#435443]">Daily tasks currently lined up.</p>
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
                  className="rounded-[24px] bg-[rgba(246,241,231,0.62)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">{learner.stage}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.name}</p>
                  <p className="mt-1 text-sm text-[#435443]">
                    {learner.track} • {learner.referenceLevel} • {learner.internalBand}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Focus</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {learner.focus.map((focusItem) => (
                        <li
                          key={focusItem}
                          className="rounded-full bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-medium text-[#314531]"
                        >
                          {focusItem}
                        </li>
                      ))}
                    </ul>
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
