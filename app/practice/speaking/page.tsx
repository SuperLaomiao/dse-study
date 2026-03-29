import SpeakingAiStudio from "@/components/practice/speaking-ai-studio";
import PlaceholderPage from "@/components/placeholder-page";

export default function PracticeSpeakingPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Speaking AI Studio"
      description="Upload one short response and get examiner-style judgement plus coaching that helps the learner and the parent see the same next step."
      currentPath="/practice"
      sections={[
        {
          title: "AI feedback studio",
          content: <SpeakingAiStudio />
        },
        {
          title: "Why this works for DSE",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Pattern first</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Build reusable frames</p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  Learners stabilise common sentence shapes before being asked to improvise under pressure.
                </p>
              </article>
              <article className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Exam simulation</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Answer the actual question</p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  Exam mode judges whether the learner really responds, not just whether the English sounds polished.
                </p>
              </article>
              <article className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Parent visibility</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">One plain-language summary</p>
                <p className="mt-1 text-sm leading-6 text-[#435443]">
                  The same run produces a parent summary so support at home matches the learner’s real weak point.
                </p>
              </article>
            </div>
          )
        }
      ]}
    />
  );
}
