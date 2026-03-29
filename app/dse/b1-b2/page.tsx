import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function B1B2ReadinessPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="B1/B2 Readiness"
      description="A narrow readiness board for deciding whether the learner can tolerate tougher DSE-style demands without losing control."
      currentPath="/progress"
      sections={[
        {
          title: "Readiness status",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Reading under time</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Nearly ready</p>
                <p className="mt-1 text-sm text-[#435443]">Inference quality is there; the clock still creates drift.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Vocabulary floor</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Stable</p>
                <p className="mt-1 text-sm text-[#435443]">Review loops are strong enough to support a harder next cycle.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Speaking spillover</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Watch closely</p>
                <p className="mt-1 text-sm text-[#435443]">{learner.name} still needs easy wins built into the week.</p>
              </div>
            </div>
          )
        },
        {
          title: "Recommendation",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Increase reading pressure slightly, keep vocabulary revision exactly where it is, and avoid stacking
                hard reading and speaking on the same day.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/dse"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open DSE dashboard
                </a>
                <a
                  href="/practice/reading"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Open reading module
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
