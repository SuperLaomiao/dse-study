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
      description="Track, stage, goals, and study targets now live in a real form boundary."
      currentPath="/learn"
      sections={[
        {
          title: "Profile settings",
          content: <OnboardingProfileForm profile={profile} />
        }
      ]}
    />
  );
}
