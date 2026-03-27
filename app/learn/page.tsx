import PlaceholderPage from "@/components/placeholder-page";

export default function LearnPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Learn"
      description="Daily plan generation and completion flow will live on this surface."
      currentPath="/learn"
      sections={[
        {
          title: "Study flow",
          content: <p>Recommended tasks, reasons, and completion states will appear here.</p>
        }
      ]}
    />
  );
}
