import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeReadingPage() {
  return (
    <PracticeModulePage
      title="Reading"
      description="DSE-style reading sets and diagnostics will appear here."
      leadLabel="Inference set"
      leadValue="Timing support"
      leadDetail="Use a short set with visible pacing so comprehension and inference improve without losing confidence."
      checkpoints={[
        "Skim first, then answer only the inference-heavy items.",
        "Notice which wrong answers come from rushing rather than misunderstanding.",
        "Use the next review to see whether pacing is stabilising."
      ]}
      primaryLink={{ href: "/practice", label: "Back to practice hub" }}
      secondaryLink={{ href: "/progress", label: "Open progress" }}
    />
  );
}
