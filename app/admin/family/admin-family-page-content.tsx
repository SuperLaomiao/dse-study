"use client";

import { useState } from "react";

import InviteModal from "@/components/invite/invite-modal";
import PlaceholderPage from "@/components/placeholder-page";
import { pickLocale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";

export function AdminFamilyPageContent({
  locale,
  snapshot,
  family,
  learners,
  activePlans,
  activeAlerts,
  nextLearner
}: {
  locale: "en" | "zh";
  snapshot: any;
  family: any;
  learners: any[];
  activePlans: number;
  activeAlerts: number;
  nextLearner: any;
}) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <PlaceholderPage
      locale={locale}
      role="admin"
      title={snapshot.familyLabel}
      description={
        locale === "zh"
          ? `${family.familyName}，由 ${snapshot.adminName} 管理`
          : `${family.familyName} managed by ${snapshot.adminName}`
      }
      sections={[
        {
          title: pickLocale(locale, { zh: "操作台", en: "Action desk" }),
          content: (
            <div className="rounded-[28px] border border-[rgba(35,64,43,0.1)] bg-[linear-gradient(145deg,rgba(252,247,239,0.98),rgba(229,239,229,0.92))] p-5">
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                {pickLocale(locale, {
                  zh: "先停留在家庭视图里逐个检查学习者；如果需要介入，再直接跳到提醒页或系统状态。",
                  en: "Stay on the family surface for learner-by-learner checks, then jump straight into alerts or system status when something needs intervention."
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/admin/alerts"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                >
                  {pickLocale(locale, { zh: "打开提醒看板", en: "Open Alerts Board" })}
                </a>
                <a
                  href="/admin/system"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "打开系统检查", en: "Open System Checks" })}
                </a>
                <Button
                  onClick={() => setInviteModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand-strong)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand)]"
                >
                  {pickLocale(locale, { zh: "邀请成员", en: "Invite Member" })}
                </Button>
              </div>
              <InviteModal
                open={inviteModalOpen}
                onOpenChange={setInviteModalOpen}
                locale={locale}
              />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "决策板", en: "Decision board" }),
          content: (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  {pickLocale(locale, { zh: "当前提醒", en: "Active alerts" })}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{activeAlerts}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {pickLocale(locale, {
                    zh: "把家庭页当作决策主界面，再优先打开最需要处理的那位学习者。",
                    en: "Keep the family view as the decision surface, then jump into the learner that needs attention first."
                  })}
                </p>
                {nextLearner ? (
                  <a
                    href={`/admin/learner/${nextLearner.id}`}
                    className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {locale === "zh" ? `先看 ${nextLearner.name}` : `Open ${nextLearner.name} first`}
                  </a>
                ) : null}
              </div>
              <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  {pickLocale(locale, { zh: "下一步检查", en: "Next checks" })}
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                  <p>{pickLocale(locale, { zh: "1. 先看最新的学习者提醒，并检查对应任务队列。", en: "1. Review the newest learner alert and check their queue." })}</p>
                  <p>{pickLocale(locale, { zh: "2. 只有当健康信号或 schema 状态异常时，再打开系统状态。", en: "2. Open system status only if the health signal or schema setup looks off." })}</p>
                  <p>{pickLocale(locale, { zh: "3. 如果需要家庭范围的提醒清单，再回到提醒页。", en: "3. Return to alerts when you need a family-wide reminder list." })}</p>
                </div>
                <a
                  href="/api/health"
                  className="mt-4 inline-flex rounded-full border border-[rgba(35,64,43,0.16)] bg-[var(--cream)] px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-white"
                >
                  {pickLocale(locale, { zh: "打开健康检查", en: "Open Health Check" })}
                </a>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "家庭概览", en: "Household snapshot" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "家庭", en: "Family" })}</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{family.familyName}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{pickLocale(locale, { zh: "管理者", en: "Managed by" })}</p>
                <p className="text-sm font-medium text-[var(--foreground)]">{snapshot.adminName}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "学习者", en: "Learners" })}</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learners.length}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {pickLocale(locale, { zh: "这个家庭当前启用中的学习者档案数。", en: "Active learner profiles in the family." })}
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "计划", en: "Plans" })}</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{activePlans}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {pickLocale(locale, { zh: "当前已经排入的每日任务总数。", en: "Daily tasks currently lined up." })}
                </p>
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "家庭摘要", en: "Family summary" }),
          content: (
            <div className="grid gap-3 md:grid-cols-2">
              {learners.map((learner) => (
                <article
                  key={learner.id}
                  className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{learner.stage}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{learner.name}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {learner.track} • {learner.referenceLevel} • {learner.internalBand}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{pickLocale(locale, { zh: "当前重点", en: "Focus" })}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {learner.focus.map((focusItem: string) => (
                        <li
                          key={focusItem}
                          className="rounded-full border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.92)] px-3 py-1 text-xs font-medium text-[var(--brand)]"
                        >
                          {focusItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`/admin/learner/${learner.id}`}
                    className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
                  >
                    {locale === "zh" ? `打开 ${learner.name}` : `Open ${learner.name}`}
                  </a>
                </article>
              ))}
            </div>
          )
        }
      ]}
    />
  );
}
