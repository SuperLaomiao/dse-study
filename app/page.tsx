import PlaceholderPage from "@/components/placeholder-page";

export default function LandingPage() {
  return (
    <PlaceholderPage
      role="public"
      title="DSE Study"
      description="Family English learning built for daily momentum, calmer oversight, and long-term DSE growth."
      sections={[
        {
          title: "Why families stay with it",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Daily momentum</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Short loops, no drift</p>
                <p className="mt-1 text-sm text-[#435443]">Practice and review stay narrow so progress compounds.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Family visibility</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Clear household view</p>
                <p className="mt-1 text-sm text-[#435443]">Parents can see focus, alerts, and next decisions at a glance.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">DSE framing</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Reference level with exam lens</p>
                <p className="mt-1 text-sm text-[#435443]">Keep daily work anchored to longer-term DSE outcomes.</p>
              </div>
            </div>
          )
        },
        {
          title: "Next step",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Start with the learner preview if you want to feel the product, or sign in directly if the family
                workspace is already set up.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Open sign in
                </a>
                <a
                  href="/home"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#23402b] transition hover:bg-white"
                >
                  Preview learner home
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
