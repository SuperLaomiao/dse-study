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
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(76,110,67,0.9))] p-5 text-[#f8f5ed]">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(248,245,237,0.72)]">
                Continue from today&apos;s queue
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
                {recommendedTask?.title ?? "Vocabulary Loop"}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.82)]">
                {recommendedTask?.detail ??
                  "Stay inside one narrow practice loop so the next review can measure real lift."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={practiceLinks[recommendedTask?.title as keyof typeof practiceLinks] ?? "/practice/vocabulary"}
                  className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                >
                  Start recommended block
                </a>
                <a
                  href="/review/biweekly"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.28)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
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
                  className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Today</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{task.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#435443]">{task.detail}</p>
                  <a
                    href={practiceLinks[task.title as keyof typeof practiceLinks] ?? "/practice"}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#23402b] shadow-[0_10px_24px_rgba(31,42,31,0.08)] transition hover:bg-[#fcfaf5]"
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
                    className="rounded-[24px] border border-dashed border-[rgba(35,64,43,0.12)] bg-[rgba(255,255,255,0.6)] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Explore</p>
                    <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#435443]">
                      Keep this module available when you want to rotate the practice mix.
                    </p>
                    <a
                      href={href}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.12)] bg-white/70 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
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
