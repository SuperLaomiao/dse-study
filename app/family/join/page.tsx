import AccountFlowStage from "@/components/account/account-flow-stage";
import FamilyJoinForm from "@/components/account/family-join-form";
import PlaceholderPage from "@/components/placeholder-page";

export default function FamilyJoinPage() {
  return (
    <PlaceholderPage
      role="public"
      title="Join Family"
      description="Use the learner email and invite code to attach into the family space without creating a duplicate account flow."
      sections={[
        {
          title: "Step 2 of 3",
          content: (
            <AccountFlowStage
              step="Step 2 of 3"
              title="Attach the learner to the existing family with one stable identity."
              description="This step should feel like a clean handoff, not a second onboarding fork. Use the learner email that should own the study plan, join the household once, then move straight to learner profile calibration."
              actions={
                <>
                  <a
                    href="/onboarding/profile"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)]"
                  >
                    Continue to learner profile
                  </a>
                  <a
                    href="/sign-in"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
                  >
                    Back to sign-in
                  </a>
                </>
              }
            />
          )
        },
        {
          title: "What you need",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Learner email</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Keep identity stable</p>
                <p className="mt-1 text-sm text-[#435443]">This is how the learner profile and future login map to the right child.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Invite code</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Family handshake</p>
                <p className="mt-1 text-sm text-[#435443]">Use the admin-provided code so the learner lands in the correct household.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Demo invite</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">CHAN-FAMILY</p>
                <p className="mt-1 text-sm text-[#435443]">You can use the seeded demo code to explore the MVP flow quickly.</p>
              </div>
            </div>
          )
        },
        {
          title: "Join form",
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                Start with the learner email that should own the study plan. If you are just exploring, use the demo join code.
              </p>
              <FamilyJoinForm />
            </div>
          )
        },
        {
          title: "Need a household first",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                If no family has been created yet, go back and create the parent workspace before trying to join with a learner account.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/family/create"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Need to create the family first?
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
