import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeWritingPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Writing"
      description="Planning mode and draft mode will be built on this route."
      currentPath="/practice"
      sections={[
        {
          title: "Writing workspace",
          content: <p>Guided structure, drafting, and feedback blocks will appear here.</p>
        }
      ]}
    />
  );
}
