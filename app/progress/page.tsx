import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function ProgressPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="Progress"
      description="Visible growth matters. This page keeps Reference Level and trend cards trustworthy."
      currentPath="/progress"
      sections={[
        {
          title: "Reference level arc",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Current</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.referenceLevel} now</p>
                <p className="mt-1 text-sm text-[#435443]">Reference level for current tasks.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Working band</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">
                  {learner.internalBand} working band
                </p>
                <p className="mt-1 text-sm text-[#435443]">Used to tune the next cycle difficulty.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Trend</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Stable upward rhythm</p>
                <p className="mt-1 text-sm text-[#435443]">
                  Consistency is good enough to push one area harder next cycle.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Review moments",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Keep the assessment loop visible so every practice block maps back to a checkpoint.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/assessment/baseline"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open baseline assessment
                </a>
                <a
                  href="/review/biweekly"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  See bi-weekly review
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
