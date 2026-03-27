import PlaceholderPage from "@/components/placeholder-page";

export default function BiweeklyReviewPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Bi-weekly Review"
      description="Long-term learning resets and review checkpoints will start here."
      currentPath="/learn"
      sections={[
        {
          title: "Review checkpoint",
          content: <p>This route will refresh priorities without punishing missed study days.</p>
        }
      ]}
    />
  );
}
