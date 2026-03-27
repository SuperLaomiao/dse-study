import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeListeningPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Listening"
      description="Paper 3 style listening and integrated tasks will live here."
      currentPath="/practice"
      sections={[
        {
          title: "Listening flow",
          content: <p>Audio playback, note capture, and response input are reserved here.</p>
        }
      ]}
    />
  );
}
