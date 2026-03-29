import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

const practiceLinks = {
  "Vocabulary Loop": "/practice/vocabulary",
  Reading: "/practice/reading",
  Listening: "/practice/listening",
  "Speaking Phrase Loop": "/practice/speaking",
  Writing: "/practice/writing"
} as const;

const practiceLabels = {
  "Vocabulary Loop": "vocabulary",
  Reading: "reading",
  Listening: "listening",
  "Speaking Phrase Loop": "speaking",
  Writing: "writing"
} as const;

export default function PracticeHubPage() {
  const learner = getDefaultLearner();
  const recommendedTask = learner.dailyPlan[0];

  return (
    <PlaceholderPage
      role="learner"
      title="Practice"
      description="Choose a focused module or continue the current recommended session."
      currentPath="/practice"
      sections={[
        {
          title: "Recommended next move",
          content: (
            <div className="rounded-[28px] border border-[rgba(24,51,33,0.18)] bg-[linear-gradient(135deg,#23402b_0%,#4d6842_62%,#738b65_100%)] p-5 text-[var(--cream)] shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(255,250,243,0.72)]">
                Continue from today&apos;s queue
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                {recommendedTask?.title ?? "Vocabulary Loop"}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(255,250,243,0.84)]">
                {recommendedTask?.detail ??
                  "Stay inside one narrow practice loop so the next review can measure real lift."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={practiceLinks[recommendedTask?.title as keyof typeof practiceLinks] ?? "/practice/vocabulary"}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand-strong)] shadow-[0_14px_28px_rgba(18,34,22,0.18)] transition hover:bg-white"
                >
                  Start recommended block
                </a>
                <a
                  href="/review/biweekly"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(255,250,243,0.3)] bg-[rgba(255,250,243,0.1)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,250,243,0.18)]"
                >
                  See review rhythm
                </a>
              </div>
            </div>
          )
        },
        {
          title: "Modules",
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {learner.dailyPlan.map((task) => (
                <article
                  key={task.title}
                  className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Today</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{task.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{task.detail}</p>
                  <a
                    href={practiceLinks[task.title as keyof typeof practiceLinks] ?? "/practice"}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--brand)] shadow-[0_10px_24px_rgba(31,42,31,0.08)] transition hover:bg-white"
                  >
                    {`Open ${practiceLabels[task.title as keyof typeof practiceLabels] ?? "practice"} module`}
                  </a>
                </article>
              ))}

              {Object.entries(practiceLinks)
                .filter(([title]) => !learner.dailyPlan.some((task) => task.title === title))
                .map(([title, href]) => (
                  <article
                    key={title}
                    className="rounded-[24px] border border-dashed border-[rgba(35,64,43,0.14)] bg-[rgba(255,255,255,0.82)] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Explore</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      Keep this module available when you want to rotate the practice mix.
                    </p>
                    <a
                      href={href}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                    >
                      {`Open ${practiceLabels[title as keyof typeof practiceLabels] ?? "practice"} module`}
                    </a>
                  </article>
                ))}
            </div>
          )
        }
      ]}
    />
  );
}
