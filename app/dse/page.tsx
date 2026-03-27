import PlaceholderPage from "@/components/placeholder-page";

export default function DseDashboardPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="DSE Dashboard"
      description="Exam-aware framing and component readiness will live on this page."
      currentPath="/progress"
      sections={[
        {
          title: "Exam lens",
          content: <p>Paper 1 to Paper 4 signals and DSE-specific next steps belong here.</p>
        }
      ]}
    />
  );
}
