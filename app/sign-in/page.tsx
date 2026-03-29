import EmailSignInForm from "@/components/account/email-sign-in-form";
import PlaceholderPage from "@/components/placeholder-page";
import { redirectIfSignedIn } from "@/lib/auth/server";

export default async function SignInPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await redirectIfSignedIn();
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;

  return (
    <PlaceholderPage
      role="public"
      title="Sign In"
      description="Use a demo email to enter the right learner or admin experience."
      sections={[
        {
          title: "Start here",
          content: (
            <div className="space-y-4">
              <p className="text-sm text-[#435443]">
                Choose the fastest route into the demo or onboarding flow.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <RouteCard
                  title="Create a Family"
                  href="/family/create"
                  description="Start the parent setup flow and invite learners after the family shell is ready."
                />
                <RouteCard
                  title="Join a Family"
                  href="/family/join"
                  description="Use the invite code flow for a learner or sibling joining an existing setup."
                />
                <RouteCard
                  title="Preview Learner Home"
                  href="/home"
                  description="Jump straight into the learner-side experience if you only want to inspect the study UI."
                />
              </div>
            </div>
          )
        },
        {
          title: "Email sign-in",
          content: (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.9fr)]">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Demo access</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#435443]">
                  <li>`mom@example.com` opens the admin dashboard and family controls.</li>
                  <li>`brother@example.com` lands in the older learner path and DSE practice flow.</li>
                  <li>`sister@example.com` lands in the younger learner path with lighter baseline pacing.</li>
                </ul>
              </div>
              <EmailSignInForm error={error} />
            </div>
          )
        },
        {
          title: "After sign-in",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <StatusHint
                title="Admin path"
                description="Family admins go to the household overview, alerts, and database system tools."
              />
              <StatusHint
                title="Learner path"
                description="Learners drop into home, practice, progress, and review without touching admin screens."
              />
              <StatusHint
                title="Manual testing"
                description="Use the family create/join links above when you want to test onboarding instead of the fast demo sign-in."
              />
            </div>
          )
        }
      ]}
    />
  );
}

function RouteCard({
  title,
  href,
  description
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-[24px] border border-[rgba(31,42,31,0.08)] bg-white/80 p-4 transition hover:border-[rgba(35,64,43,0.18)] hover:bg-white"
    >
      <p className="text-base font-semibold text-[#1f2a1f]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#435443]">{description}</p>
    </a>
  );
}

function StatusHint({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] bg-[rgba(246,241,231,0.72)] p-4">
      <p className="text-sm font-semibold text-[#1f2a1f]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#435443]">{description}</p>
    </div>
  );
}
