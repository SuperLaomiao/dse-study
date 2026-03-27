import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDemoLearnerById } from "@/lib/data/learner";

export default async function AdminLearnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireServerRole("admin");
  const { id } = await params;
  const learner = getDemoLearnerById(id);

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
          title: "Current status",
          content: (
            <p>
              Reference Level {learner.referenceLevel} with {learner.internalBand}.
            </p>
          )
        },
        {
          title: "Current focus",
          content: (
            <ul className="space-y-2">
              {learner.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
      ]}
    />
  );
}
