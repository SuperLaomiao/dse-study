import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeVocabularyPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Vocabulary Loop"
      description="Listen, recall, record, and review vocabulary here."
      currentPath="/practice"
      sections={[
        {
          title: "Session preview",
          content: <p>Audio play, record, and spaced review will be attached in the next phase.</p>
        }
      ]}
    />
  );
}
