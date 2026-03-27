import OnboardingProfileForm from "@/components/account/onboarding-profile-form";
import PlaceholderPage from "@/components/placeholder-page";
import { getCurrentDemoUser, requireServerRole } from "@/lib/auth/server";
import { getLearnerProfileByUserId } from "@/lib/repositories/profile-repository";

export default async function OnboardingProfilePage() {
  await requireServerRole("learner");
  const user = await getCurrentDemoUser();
  const profile = user ? await getLearnerProfileByUserId(user.userId) : null;

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
