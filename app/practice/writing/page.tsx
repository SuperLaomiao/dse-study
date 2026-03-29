import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeWritingPage() {
  return (
    <PracticeModulePage
      title="Writing"
      description="Planning mode and draft mode will be built on this route."
      leadLabel="Writing workspace"
      leadValue="Structure before draft"
      leadDetail="Keep planning visible so the learner improves organisation, not just sentence output."
      boardCards={[
        {
          label: "Primary move",
          value: "Plan first",
          detail: "Outline the argument and body direction before expanding any sentence."
        },
        {
          label: "Draft restraint",
          value: "One target move",
          detail: "Choose one linking or sentence pattern to improve instead of chasing everything."
        },
        {
          label: "Review hook",
          value: "Compare plan vs draft",
          detail: "Judge whether the finished paragraph still matches the original outline shape."
        }
      ]}
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
