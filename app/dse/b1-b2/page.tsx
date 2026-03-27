import PlaceholderPage from "@/components/placeholder-page";

export default function B1B2ReadinessPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="B1/B2 Readiness"
      description="The older brother track will use this page to monitor readiness for higher DSE demands."
      currentPath="/progress"
      sections={[
        {
          title: "Readiness status",
          content: <p>Band trajectory, component balance, and recommendations will be shown here.</p>
        }
      ]}
    />
  );
}
