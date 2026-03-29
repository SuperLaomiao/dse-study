import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeListeningPage() {
  return (
    <PracticeModulePage
      title="Listening"
      description="Paper 3 style listening and integrated tasks will live here."
      leadLabel="Listening flow"
      leadValue="Note capture"
      leadDetail="Train quick capture of keywords and transitions before worrying about full-answer polish."
      boardCards={[
        {
          label: "Primary move",
          value: "Anchor notes",
          detail: "Use short anchors instead of full wording on the first pass."
        },
        {
          label: "Replay discipline",
          value: "Patch gaps only",
          detail: "Replay is for weak zones, not for restarting the whole clip."
        },
        {
          label: "Listening target",
          value: "Signal words",
          detail: "Catch transitions, contrast, and cause-effect markers before detail phrases."
        }
      ]}
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
