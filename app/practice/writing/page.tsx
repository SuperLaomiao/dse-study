import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeWritingPage() {
  return (
    <PracticeModulePage
      title="Writing"
      description="Planning mode and draft mode will be built on this route."
      leadLabel="Writing workspace"
      leadValue="Structure before draft"
      leadDetail="Keep planning visible so the learner improves organisation, not just sentence output."
      checkpoints={[
        "Draft the opening line and three body bullets before writing paragraphs.",
        "Keep one target structure or linking move for this session only.",
        "Use review day to compare planning quality against final clarity."
      ]}
      primaryLink={{ href: "/practice", label: "Back to practice hub" }}
      secondaryLink={{ href: "/review/biweekly", label: "See review rhythm" }}
    />
  );
}
