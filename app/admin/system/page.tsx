import DatabaseOpsCard from "@/components/admin/database-ops-card";
import PlaceholderPage from "@/components/placeholder-page";
import { requireServerRole } from "@/lib/auth/server";
import { getDatabaseAdminStatus } from "@/lib/database-admin";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AdminSystemPage() {
  await requireServerRole("admin");
  const locale = await getRequestLocale();
  const status = await getDatabaseAdminStatus(locale);

  return (
    <PlaceholderPage
      locale={locale}
      role="admin"
      title={pickLocale(locale, { zh: "数据库运维", en: "Database Ops" })}
      description={pickLocale(locale, {
        zh: "在这个仅管理员可见的工作台里验证 Vercel 上的 Neon Postgres，并安全初始化 schema。",
        en: "Use this admin-only workspace to verify Neon Postgres on Vercel and initialize the schema safely."
      })}
      sections={[
        {
          title: pickLocale(locale, { zh: "控制台", en: "Control room" }),
          content: (
            <div className="space-y-4">
              <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(78,113,68,0.9))] p-5 text-[#f8f5ed]">
                <p className="max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.8)]">
                  {pickLocale(locale, {
                    zh: "把这里当成数据健康与环境状态的运维检查点；如果应用层面需要处理，再跳回家庭看板或提醒页。",
                    en: "Use this page as the operational checkpoint for data health, then jump back into the family dashboard or alerts if the app itself needs attention."
                  })}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/admin/family"
                    className="inline-flex items-center justify-center rounded-full bg-[#f8f5ed] px-4 py-2 text-sm font-semibold text-[#1f2a1f] transition hover:bg-white"
                  >
                    {pickLocale(locale, { zh: "打开家庭看板", en: "Open Family Dashboard" })}
                  </a>
                  <a
                    href="/admin/alerts"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.24)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                  >
                    {pickLocale(locale, { zh: "打开提醒看板", en: "Open Alerts Board" })}
                  </a>
                  <a
                    href="/api/health"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(248,245,237,0.24)] px-4 py-2 text-sm font-semibold text-[#f8f5ed] transition hover:bg-[rgba(248,245,237,0.08)]"
                  >
                    {pickLocale(locale, { zh: "打开健康检查", en: "Open Health Check" })}
                  </a>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <RunbookCard
                  title={pickLocale(locale, { zh: "执行顺序", en: "Run order" })}
                  steps={pickLocale(locale, {
                    zh: [
                      "1. 改 schema 之前，先确认健康检查与数据库连通性。",
                      "2. 环境已经指向正确的 Neon 数据库后，再初始化 schema。",
                      "3. 只有 schema 就绪后，才写入演示数据。"
                    ],
                    en: [
                      "1. Confirm health and connectivity before changing schema.",
                      "2. Bootstrap schema once the environment points at the right Neon database.",
                      "3. Seed demo data only after schema is ready."
                    ]
                  })}
                />
                <RunbookCard
                  title={pickLocale(locale, { zh: "何时暂停", en: "When to stop" })}
                  steps={pickLocale(locale, {
                    zh: [
                      "1. 如果健康检查显示不可达，或问题代码提示凭据错误，就先暂停。",
                      "2. schema 还缺失时不要写入种子数据。",
                      "3. 只有状态摘要明确显示就绪后，再回到提醒或家庭页。"
                    ],
                    en: [
                      "1. Pause if health says unreachable or the issue code shows wrong credentials.",
                      "2. Do not seed if schema is still missing.",
                      "3. Go back to alerts or family only after the status summary reads ready."
                    ]
                  })}
                />
                <RunbookCard
                  title={pickLocale(locale, { zh: "快速核查", en: "Fast checks" })}
                  steps={pickLocale(locale, {
                    zh: [
                      "1. 健康检查接口用于确认运行时接线正常。",
                      "2. 家庭看板用于确认管理端读数正常。",
                      "3. 学习者详情页用于确认练习与任务队列仍可渲染。"
                    ],
                    en: [
                      "1. Health endpoint confirms runtime wiring.",
                      "2. Family dashboard confirms admin-facing data reads.",
                      "3. Learner detail confirms practice and queue views still render."
                    ]
                  })}
                />
              </div>
            </div>
          )
        },
        {
          title: "Neon Postgres",
          content: <DatabaseOpsCard locale={locale} status={status} />
        }
      ]}
    />
  );
}

function RunbookCard({
  title,
  steps
}: {
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-[24px] bg-[rgba(246,241,231,0.72)] p-4">
      <p className="text-sm font-semibold text-[#1f2a1f]">{title}</p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-[#435443]">
        {steps.map((step) => (
          <p key={step}>{step}</p>
        ))}
      </div>
    </div>
  );
}
