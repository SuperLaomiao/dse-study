import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeVocabularyPage() {
  return (
    <PracticeModulePage
      title="Vocabulary Loop"
      description="Listen, recall, record, and review vocabulary here."
      leadLabel="Loop cadence"
      leadValue="Recall drill"
      leadDetail="Stay inside one repeatable phrase set, then check whether recall survives without prompts."
      checkpoints={[
        "Listen once, speak once, then do a no-audio recall pass.",
        "Mark the phrases that still need another cycle before review day.",
        "Keep the set narrow so the next repetition actually compounds."
      ]}
      primaryLink={{ href: "/practice", label: "Back to practice hub" }}
      secondaryLink={{ href: "/progress", label: "Open progress" }}
    />
  );
}
