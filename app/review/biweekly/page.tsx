import PlaceholderPage from "@/components/placeholder-page";

export default function BiweeklyReviewPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Bi-weekly Review"
      description="Long-term learning resets and review checkpoints now land as concrete decisions."
      currentPath="/learn"
      sections={[
        {
          title: "Reset decisions",
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="grid gap-3 md:grid-cols-3">
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Keep</p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    Vocabulary loop as the warm-up anchor.
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Tighten</p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    Inference tasks need shorter, timed sets.
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                    Drop friction
                  </p>
                  <p className="mt-2 font-medium text-[#1f2a1f]">
                    Make review days lighter if the week was uneven.
                  </p>
                </article>
              </div>
              <aside className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-white/82 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  Review scoreboard
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[#435443]">
                  <p>
                    Working loop held for <span className="font-semibold text-[#1f2a1f]">9 of the last 12 days</span>.
                  </p>
                  <p>
                    Confidence stayed positive, but timed inference remains the deciding gap.
                  </p>
                  <p>
                    Keep the plan narrow for one more cycle before raising the weekly load.
                  </p>
                </div>
              </aside>
            </div>
          )
        },
        {
          title: "Next route",
          content: (
            <div className="flex flex-wrap gap-3">
              <a
                href="/progress"
                className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
              >
                Open progress
              </a>
              <a
                href="/review/result"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.14)] bg-[rgba(246,241,231,0.78)] px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-[rgba(246,241,231,0.95)]"
              >
                Open review result
              </a>
              <a
                href="/practice"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.14)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
              >
                Return to practice
              </a>
            </div>
          )
        }
      ]}
    />
  );
}
