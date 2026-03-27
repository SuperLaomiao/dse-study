import PlaceholderPage from "@/components/placeholder-page";

export default function ReviewResultPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Review Result"
      description="Bi-weekly summaries and next-cycle changes will be displayed here."
      currentPath="/progress"
      sections={[
        {
          title: "Summary",
          content: <p>Trend cards, weak areas, and updated study priorities will be presented here.</p>
        }
      ]}
    />
  );
}
