import { requireServerRole } from "@/lib/auth/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { getAdminLearnerDetailById } from "@/lib/repositories/profile-repository";
import { getLearnerProgressStats } from "@/lib/repositories/progress-repository";
import { AdminLearnerProgressPageContent } from "./admin-learner-progress-page-content";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AdminLearnerProgressPage({ params }: PageProps) {
  await requireServerRole("admin");
  const locale = await getRequestLocale();
  const learnerId = params.id;

  const learnerProfile = await getAdminLearnerDetailById(learnerId, locale);
  const progressStats = await getLearnerProgressStats(learnerId, locale);

  if (!learnerProfile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">
          {locale === "zh" ? "学习者未找到" : "Learner not found"}
        </h1>
        <a href="/admin/family" className="text-[var(--brand)] hover:underline mt-4 inline-block">
          {locale === "zh" ? "返回家庭管理" : "Back to Family Management"}
        </a>
      </div>
    );
  }

  return (
    <AdminLearnerProgressPageContent
      locale={locale}
      learnerId={learnerId}
      learnerProfile={learnerProfile}
      progressStats={progressStats}
    />
  );
}
