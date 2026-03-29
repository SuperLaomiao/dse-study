import PracticeModulePage from "@/components/practice-module-page";

export default function PracticeSpeakingPage() {
  return (
    <PracticeModulePage
      title="Speaking Phrase Loop"
      description="Shadowing, replay, and prompt practice will be staged here."
      leadLabel="Speaking flow"
      leadValue="Confidence loop"
      leadDetail="Repeat one prompt family enough times that fluency improves without sounding memorised."
      boardCards={[
        {
          label: "Primary move",
          value: "Short-frame reps",
          detail: "Stay within one prompt family until delivery feels lighter and faster."
        },
        {
          label: "Fluency guardrail",
          value: "Keep sentence frames short",
          detail: "Do not increase complexity if the learner starts hesitating on control phrases."
        },
        {
          label: "Immediate check",
          value: "Replay once",
          detail: "Listen back right away and mark the phrase that still collapses under pressure."
        }
      ]}
      checkpoints={[
        "Shadow the model phrase once to settle rhythm and stress.",
        "Record one free response using the same sentence frame.",
        "Replay immediately and mark the phrase that still feels unstable."
      ]}
      primaryLink={{ href: "/practice", label: "Back to practice hub" }}
      secondaryLink={{ href: "/progress", label: "Open progress" }}
    />
  );
}
