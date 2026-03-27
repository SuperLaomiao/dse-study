import FamilyCreateForm from "@/components/account/family-create-form";
import PlaceholderPage from "@/components/placeholder-page";

export default function FamilyCreatePage() {
  return (
    <PlaceholderPage
      role="public"
      title="Create Family"
      description="Start the family container and prepare the learner invite flow."
      sections={[
        {
          title: "Setup form",
          content: <FamilyCreateForm />
        }
      ]}
    />
  );
}
