import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function LearnPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="Learn"
      description="Daily plan generation and completion flow now starts from a clearer learning loop."
      currentPath="/learn"
      sections={[
        {
          title: "Today’s learning loop",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(76,110,67,0.9))] p-5 text-[#f8f5ed]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(248,245,237,0.72)]">
                Sequence
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
                Warm up, practice, then review the exact weak point.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.82)]">
                {learner.name} is working through a narrow cycle so every session compounds instead
                of scattering attention.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/practice"
                  className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                >
                  Open practice hub
                </a>
                <a
                  href="/progress"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.24)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                >
                  Review progress
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Reason stack",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Why this first</p>
                <p className="mt-2 font-medium text-[#1f2a1f]">Inference still needs repetition.</p>
              </article>
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">What to protect</p>
                <p className="mt-2 font-medium text-[#1f2a1f]">Speaking confidence should not dip.</p>
              </article>
              <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Review edge</p>
                <p className="mt-2 font-medium text-[#1f2a1f]">Keep the loop stable enough for review day.</p>
              </article>
            </div>
          )
        }
      ]}
    />
  );
}
