import EmailSignInForm from "@/components/account/email-sign-in-form";
import PlaceholderPage from "@/components/placeholder-page";
import { redirectIfSignedIn } from "@/lib/auth/server";

export default async function SignInPage() {
  await redirectIfSignedIn();

  return (
    <PlaceholderPage
      role="public"
      title="Sign In"
      description="Use a demo email to enter the right learner or admin experience."
      sections={[
        {
          title: "Email sign-in",
          content: <EmailSignInForm />
        }
      ]}
    />
  );
}
