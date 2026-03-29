import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeListeningPage() {
  return (
    <PracticeModulePage
      title="Listening"
      description="Paper 3 style listening and integrated tasks will live here."
      leadLabel="Listening flow"
      leadValue="Note capture"
      leadDetail="Train quick capture of keywords and transitions before worrying about full-answer polish."
      checkpoints={[
        "Preview the note frame before playback starts.",
        "Write only anchors and signal words during the first pass.",
        "Use replay to fill gaps, not to restart the whole section."
      ]}
      primaryLink={{ href: "/practice", label: "Back to practice hub" }}
      secondaryLink={{ href: "/review/biweekly", label: "See review rhythm" }}
    />
  );
}
