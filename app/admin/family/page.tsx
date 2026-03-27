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
            <div className="space-y-2">
              <p>{snapshot.adminName}</p>
              {learners.map((learner) => (
                <p key={learner.id}>
                  {learner.name} • {learner.referenceLevel} • {learner.internalBand}
                </p>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
