import PlaceholderPage from "@/components/placeholder-page";

export default function LandingPage() {
  return (
    <PlaceholderPage
      role="public"
      title="DSE Study"
      description="Family English learning built for daily momentum and long-term DSE growth."
      sections={[
        {
          title: "Why this app",
          content: (
            <p>
              Build daily study habits, track Reference Level progress, and keep family oversight simple.
            </p>
          )
        },
        {
          title: "Next step",
          content: <p>Use the sign-in flow or create the family setup to begin.</p>
        }
      ]}
    />
  );
}
