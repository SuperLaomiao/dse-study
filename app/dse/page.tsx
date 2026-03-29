import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function DseDashboardPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="DSE Dashboard"
      description="An exam-aware layer that translates daily reference-level work into paper-by-paper DSE pressure and readiness."
      currentPath="/progress"
      sections={[
        {
          title: "Exam lens",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Paper balance</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Paper 1 still drives the ceiling</p>
                <p className="mt-1 text-sm text-[#435443]">Inference and timing will keep shaping the next band jump.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Confidence anchor</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Paper 3 stays protected</p>
                <p className="mt-1 text-sm text-[#435443]">Speaking fluency should not drop while reading gets harder.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Current bracket</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.internalBand}</p>
                <p className="mt-1 text-sm text-[#435443]">Enough stability to keep pushing toward a higher DSE band.</p>
              </div>
            </div>
          )
        },
        {
          title: "Readiness route",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Use the B1/B2 view to decide whether the learner is ready to widen task complexity or should keep one
                more controlled sprint.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/dse/b1-b2"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open B1/B2 readiness
                </a>
                <a
                  href="/progress"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Back to progress
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
