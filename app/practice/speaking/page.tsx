import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeSpeakingPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Speaking Phrase Loop"
      description="Shadowing, replay, and prompt practice will be staged here."
      currentPath="/practice"
      sections={[
        {
          title: "Speaking flow",
          content: <p>Record and replay boundaries are reserved for the next feature slice.</p>
        }
      ]}
    />
  );
}
