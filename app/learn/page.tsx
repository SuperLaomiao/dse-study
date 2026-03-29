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
            <div className="overflow-hidden rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#24432d_0%,#4d6842_62%,#6e845f_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(255,250,243,0.74)]">
                Sequence
              </p>
              <p className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.03em] md:text-[2.15rem]">
                Warm up, practice, then review the exact weak point.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(255,250,243,0.84)] md:text-[15px]">
                {learner.name} is working through a narrow cycle so every session compounds instead
                of scattering attention.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/practice"
                  className="inline-flex min-w-[168px] items-center justify-center rounded-full bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand-strong)] shadow-[0_14px_28px_rgba(18,34,22,0.18)] transition hover:bg-white"
                >
                  Open practice hub
                </a>
                <a
                  href="/progress"
                  className="inline-flex min-w-[168px] items-center justify-center rounded-full border border-[rgba(255,250,243,0.28)] bg-[rgba(255,250,243,0.1)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,250,243,0.18)]"
                >
                  Review progress
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Decision board",
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="rounded-[26px] border border-[rgba(114,95,63,0.08)] bg-[linear-gradient(180deg,rgba(248,244,236,0.92),rgba(243,237,226,0.82))] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Today’s call</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)] md:text-[1.45rem]">
                  Stay narrow and protect momentum before adding anything new.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)] md:text-[15px]">
                  One focused practice block plus one review touchpoint is enough for this cycle.
                </p>
              </div>
              <div className="rounded-[26px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.92)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Next step</p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-muted)] md:text-[15px]">
                  <p>1. Run practice while the target skill is fresh.</p>
                  <p>2. Check progress once the block is complete.</p>
                  <p>3. Use the bi-weekly review to decide whether the loop should tighten or reset.</p>
                </div>
                <a
                  href="/review/biweekly"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                >
                  Open bi-weekly review
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Reason stack",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Why this first</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">Inference still needs repetition.</p>
              </article>
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">What to protect</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">Speaking confidence should not dip.</p>
              </article>
              <article className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Review edge</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">Keep the loop stable enough for review day.</p>
              </article>
            </div>
          )
        }
      ]}
    />
  );
}
