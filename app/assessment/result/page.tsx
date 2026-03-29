import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function AssessmentResultPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="Assessment Result"
      description="A quick read on reference level, internal band, and where the next practice sprint should narrow down."
      currentPath="/progress"
      sections={[
        {
          title: "Reference snapshot",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Reference level</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.referenceLevel}</p>
                <p className="mt-1 text-sm text-[#435443]">Enough control for scaffolded inference tasks.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Internal band</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{learner.internalBand}</p>
                <p className="mt-1 text-sm text-[#435443]">Used to set stretch without breaking confidence.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Strongest signal</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Review rhythm</p>
                <p className="mt-1 text-sm text-[#435443]">Consistency is good enough to push one weak area harder.</p>
              </div>
            </div>
          )
        },
        {
          title: "Next cycle focus",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Move the next sprint toward inference, keep speaking warm, and let vocabulary review carry the
                confidence layer.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/practice"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open practice
                </a>
                <a
                  href="/progress"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Open progress
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
