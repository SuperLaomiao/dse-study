import PlaceholderPage from "@/components/placeholder-page";

export default function BaselineAssessmentPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Baseline Assessment"
      description="The first diagnostic assessment will guide the next two study weeks."
      currentPath="/learn"
      sections={[
        {
          title: "Assessment structure",
          content: <p>Vocabulary, reading, listening, speaking, and writing sections begin here.</p>
        }
      ]}
    />
  );
}
