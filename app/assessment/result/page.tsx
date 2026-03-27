import PlaceholderPage from "@/components/placeholder-page";

export default function AssessmentResultPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Assessment Result"
      description="Reference Level and Internal Band results will be summarized here."
      currentPath="/progress"
      sections={[
        {
          title: "Result preview",
          content: <p>Top weak areas and the next two-week focus will appear after submission.</p>
        }
      ]}
    />
  );
}
