import FamilyCreateForm from "@/components/account/family-create-form";
import PlaceholderPage from "@/components/placeholder-page";

export default function FamilyCreatePage() {
  return (
    <PlaceholderPage
      role="public"
      title="Create Family"
      description="Start the family workspace, define the parent seat, and prepare the learner join flow in one place."
      sections={[
        {
          title: "What gets created",
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(246,241,231,0.76)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">Parent control seat</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Admin starts here</p>
                <p className="mt-1 text-sm text-[#435443]">This name anchors alerts, family overview, and future invites.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(233,244,237,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46624d]">Shared family space</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">One household view</p>
                <p className="mt-1 text-sm text-[#435443]">Learners, queues, alerts, and review rhythm live under one family label.</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,238,229,0.88)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6147]">Invite route</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2a1f]">Ready for join codes</p>
                <p className="mt-1 text-sm text-[#435443]">Use the join flow next so the learner enters the same workspace cleanly.</p>
              </div>
            </div>
          )
        },
        {
          title: "Setup form",
          content: (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#435443]">
                Keep the family name simple and recognizable. The parent name is what appears on the admin dashboard.
              </p>
              <FamilyCreateForm />
            </div>
          )
        },
        {
          title: "Next step",
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[#435443]">
                If the family has already been created, jump straight into the learner join route instead of creating a second household.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/family/join"
                  className="inline-flex items-center justify-center rounded-full bg-[#23402b] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#1f3626]"
                >
                  Already have an invite?
                </a>
              </div>
            </div>
          )
        }
      ]}
    />
  );
}
