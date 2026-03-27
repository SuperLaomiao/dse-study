import FamilyJoinForm from "@/components/account/family-join-form";
import PlaceholderPage from "@/components/placeholder-page";

export default function FamilyJoinPage() {
  return (
    <PlaceholderPage
      role="public"
      title="Join Family"
      description="Learners can validate the demo invite and attach themselves to the family space."
      sections={[
        {
          title: "Join form",
          content: <FamilyJoinForm />
        }
      ]}
    />
  );
}
