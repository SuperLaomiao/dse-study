import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";

export default async function AdminFamilyPage() {
  await requireServerRole("admin");
  const { snapshot, family, learners } = await getFamilyDashboardData();

  return (
    <PlaceholderPage
      role="admin"
      title={snapshot.familyLabel}
      description={`${family.familyName} managed by ${snapshot.adminName}`}
      sections={[
        {
          title: "Family summary",
          content: (
            <div className="space-y-3 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6 md:space-y-0">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.78)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Admin</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{snapshot.adminName}</p>
              </div>
              <div className="space-y-2">
              {learners.map((learner) => (
                <p
                  key={learner.id}
                  className="rounded-[22px] bg-[rgba(246,241,231,0.62)] px-4 py-3"
                >
                  {learner.name} • {learner.referenceLevel} • {learner.internalBand}
                </p>
              ))}
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
