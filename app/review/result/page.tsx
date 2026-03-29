import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function ReviewResultPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="Review Result"
      description="A compact decision readout after the two-week sprint so the learner knows what stays, what tightens, and what changes next."
      currentPath="/progress"
      sections={[
        {
          title: "Cycle verdict",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Keep</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Vocabulary loops</p>
                <p className="mt-1 text-sm text-[#435443]">Recall drills are protecting fluency and confidence.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Tighten</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Inference timing</p>
                <p className="mt-1 text-sm text-[#435443]">Push the reading clock without widening topic scope.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Watch</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Speaking confidence</p>
                <p className="mt-1 text-sm text-[#435443]">{learner.name} still needs frequent easy wins.</p>
              </div>
            </div>
          )
        },
        {
          title: "Reset for next sprint",
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                  Keep six study days, move the hardest task earlier in the day, and carry the same
                  review cadence into the next fortnight.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/learn"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    Return to learn
                  </a>
                  <a
                    href="/progress"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    Review progress again
                  </a>
                  <a
                    href="/practice"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    Open practice
                  </a>
                </div>
              </div>
              <aside className="rounded-[24px] bg-[rgba(255,255,255,0.82)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">
                  Next sprint checklist
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[#435443]">
                  <p>1. Keep the same warm-up anchor.</p>
                  <p>2. Move timed inference to the first hard block.</p>
                  <p>3. Protect one light speaking win every cycle.</p>
                </div>
              </aside>
            </div>
          )
        }
      ]}
    />
  );
}
