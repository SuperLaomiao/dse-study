import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function ProgressPage() {
  const learner = getDefaultLearner();
  const speakingInsight = learner.speakingInsight;

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
          title: "Latest speaking AI signal",
          content: speakingInsight ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1.05fr_1.2fr]">
                <article className="rounded-[24px] bg-[rgba(227,240,231,0.9)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Most recent drill</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{speakingInsight.taskLabel}</p>
                  <p className="mt-1 text-sm text-[#435443]">{speakingInsight.modeLabel}</p>
                </article>
                <article className="rounded-[24px] bg-[rgba(255,250,244,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Examiner signal</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{speakingInsight.examinerSignal}</p>
                  <p className="mt-2 text-sm text-[#435443]">{speakingInsight.parentSummary}</p>
                </article>
              </div>
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Coach next moves</p>
                <ul className="mt-3 grid gap-3 md:grid-cols-2">
                  {speakingInsight.coachFocus.map((move) => (
                    <li
                      key={move}
                      className="rounded-[20px] bg-white/72 px-4 py-3 text-sm font-medium text-[#314531]"
                    >
                      {move}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/practice/speaking"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    Open speaking studio
                  </a>
                  <a
                    href="/review/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    Compare with review result
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#435443]">Speaking AI feedback will appear after the first speaking studio run.</p>
          )
        },
        {
          title: "Checkpoint board",
          content: (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Assessment</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Diagnostic complete</p>
                  <p className="mt-1 text-sm text-[#435443]">Reference and band signals are calibrated for this cycle.</p>
                </div>
                <div className="rounded-[24px] bg-[rgba(246,241,231,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Sprint review</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Reset pending</p>
                  <p className="mt-1 text-sm text-[#435443]">Use the next review to keep difficulty narrow and sharp.</p>
                </div>
                <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Confidence watch</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Speaking needs protection</p>
                  <p className="mt-1 text-sm text-[#435443]">Do not let harder reading spill into speaking fatigue.</p>
                </div>
              </div>
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
                <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                  Keep the assessment loop visible so every practice block maps back to a checkpoint and a next-step
                  decision.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/assessment/baseline"
                    className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                  >
                    Open baseline assessment
                  </a>
                  <a
                    href="/assessment/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    View assessment result
                  </a>
                  <a
                    href="/review/result"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    View review result
                  </a>
                  <a
                    href="/review/biweekly"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                  >
                    See bi-weekly review
                  </a>
                </div>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
