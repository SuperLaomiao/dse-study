import { requireServerRole } from "@/lib/auth/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { getFamilyDashboardData } from "@/lib/repositories/family-repository";
import { AdminFamilyPageContent } from "./admin-family-page-content";

export default async function AdminFamilyPage() {
  await requireServerRole("admin");
  const locale = await getRequestLocale();
  const { snapshot, family, learners } = await getFamilyDashboardData(locale);
  const activePlans = learners.reduce((total, learner) => total + learner.dailyPlan.length, 0);
  const activeAlerts = snapshot.alerts.length;
  const nextLearner = learners[0];

  return (
    <AdminFamilyPageContent
      locale={locale}
      snapshot={snapshot}
      family={family}
      learners={learners}
      activePlans={activePlans}
      activeAlerts={activeAlerts}
      nextLearner={nextLearner}
    />
  );
}
