import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeReadingPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Reading"
      description="DSE-style reading sets and diagnostics will appear here."
      currentPath="/practice"
      sections={[
        {
          title: "Reading focus",
          content: <p>Passages, question blocks, and weak-area tags will be rendered here.</p>
        }
      ]}
    />
  );
}
