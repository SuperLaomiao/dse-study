import PlaceholderPage from "@/components/placeholder-page";
import { getDefaultLearner } from "@/lib/data/learner";

export default function ProgressPage() {
  const learner = getDefaultLearner();

  return (
    <PlaceholderPage
      role="learner"
      title="Progress"
      description="Visible growth matters. This page keeps Reference Level and trend cards trustworthy."
      currentPath="/progress"
      sections={[
        {
          title: "Current snapshot",
          content: (
            <p>
              {learner.name} is currently at {learner.referenceLevel} with {learner.internalBand}.
            </p>
          )
        }
      ]}
    />
  );
}
