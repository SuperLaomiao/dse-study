import OnboardingProfileForm from "@/components/account/onboarding-profile-form";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getLearnerProfileByUserId } from "@/lib/repositories/profile-repository";

export default async function OnboardingProfilePage() {
  const session = await requireServerRole("learner");

  if (!session) {
    return null;
  }

  const profile = await getLearnerProfileByUserId(session.userId);

  return (
    <PlaceholderPage
      role="learner"
      title="Learner Profile"
      description="Lock in the learner identity, daily capacity, and target band so the study loop can stay narrow and believable."
      currentPath="/learn"
      sections={[
        {
          title: "Profile settings",
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                This form controls how the app calibrates task difficulty, review pressure, and what the admin dashboard should expect from the learner.
              </p>
              <OnboardingProfileForm profile={profile} />
            </div>
          )
        },
        {
          title: "Why this profile matters",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Daily capacity</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Match the real week</p>
                <p className="mt-1 text-sm text-[#435443]">Minutes and study days decide how hard each queue should feel.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Target direction</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Reference plus band</p>
                <p className="mt-1 text-sm text-[#435443]">Both targets keep the learner and parent seeing the same north star.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Track framing</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">DSE-aware queueing</p>
                <p className="mt-1 text-sm text-[#435443]">The selected track determines whether the system leans exam-first or foundation-first.</p>
              </div>
            </div>
          )
        },
        {
          title: "Continue the loop",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                Once the profile looks right, go back to learn and let the daily loop inherit the updated capacity and targets.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/learn"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Back to learn
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
