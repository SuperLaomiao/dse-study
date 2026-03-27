import PlaceholderPage from "@/components/placeholder-page";

const modules = [
  "Vocabulary Loop",
  "Reading",
  "Listening",
  "Speaking Phrase Loop",
  "Writing"
];

export default function PracticeHubPage() {
  return (
    <PlaceholderPage
      role="learner"
      title="Practice"
      description="Choose a focused module or continue the current recommended session."
      currentPath="/practice"
      sections={[
        {
          title: "Modules",
          content: (
            <ul className="space-y-2">
              {modules.map((module) => (
                <li key={module} className="rounded-2xl bg-[rgba(246,241,231,0.72)] p-3">
                  {module}
                </li>
              ))}
            </ul>
          )
        }
      ]}
    />
  );
}
