"use client";

import { useActionState } from "react";

import {
  bootstrapDatabaseAction,
  seedDatabaseAction
} from "@/app/actions/database-admin";
import { idleDatabaseActionState } from "@/lib/action-states";
import type { DatabaseAdminStatus } from "@/lib/database-admin";
import type { Locale } from "@/lib/i18n/config";

export default function DatabaseOpsCard({ locale, status }: DatabaseOpsCardProps) {
  const [bootstrapState, bootstrapAction, bootstrapPending] = useActionState(
    bootstrapDatabaseAction,
    idleDatabaseActionState
  );
  const [seedState, seedAction, seedPending] = useActionState(
    seedDatabaseAction,
    idleDatabaseActionState
  );

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-[rgba(246,241,231,0.78)] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">
          {locale === "zh" ? "当前状态" : "Current status"}
        </p>
        <p className="mt-2 text-base font-semibold text-[#1f2a1f]">{status.summary}</p>
        <p className="mt-2 text-sm text-[#435443]">{status.nextStep}</p>
        <p className="mt-2 text-xs leading-5 text-[#6c755e]">{status.detail}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <StatusBlock
            label={locale === "zh" ? "连通性" : "Connectivity"}
            value={
              status.connectivity === "connected"
                ? locale === "zh"
                  ? "已连接"
                  : "Connected"
                : status.connectivity === "unreachable"
                  ? locale === "zh"
                    ? "不可达"
                    : "Unreachable"
                  : locale === "zh"
                    ? "演示模式"
                    : "Demo"
            }
          />
          <StatusBlock
            label={locale === "zh" ? "模式" : "Mode"}
            value={status.mode === "database" ? (locale === "zh" ? "数据库" : "Database") : locale === "zh" ? "演示" : "Demo"}
          />
          <StatusBlock
            label={locale === "zh" ? "Schema" : "Schema"}
            value={status.schemaReady ? (locale === "zh" ? "已就绪" : "Ready") : locale === "zh" ? "缺失" : "Missing"}
          />
          <StatusBlock
            label={locale === "zh" ? "种子数据" : "Seed"}
            value={status.seeded ? (locale === "zh" ? "已存在" : "Present") : locale === "zh" ? "缺失" : "Missing"}
          />
          <StatusBlock label={locale === "zh" ? "问题" : "Issue"} value={formatIssueCode(status.issueCode, locale)} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <form action={bootstrapAction} className="space-y-3 rounded-[24px] border border-[rgba(31,42,31,0.08)] p-4">
          <div>
            <p className="font-medium text-[#1f2a1f]">{locale === "zh" ? "初始化 schema" : "Bootstrap schema"}</p>
            <p className="mt-1 text-sm text-[#435443]">
              {locale === "zh"
                ? "对当前配置好的 Neon 数据库执行 Prisma `db push`。"
                : "Run Prisma `db push` against the configured Neon database."}
            </p>
          </div>
          <button
            type="submit"
            disabled={bootstrapPending}
            className="rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
          >
            {bootstrapPending
              ? locale === "zh"
                ? "初始化中..."
                : "Bootstrapping..."
              : locale === "zh"
                ? "初始化 Schema"
                : "Bootstrap Schema"}
          </button>
          {bootstrapState.status !== "idle" ? (
            <p className={bootstrapState.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
              {bootstrapState.message}
            </p>
          ) : null}
        </form>

        <form action={seedAction} className="space-y-3 rounded-[24px] border border-[rgba(31,42,31,0.08)] p-4">
          <div>
            <p className="font-medium text-[#1f2a1f]">{locale === "zh" ? "写入演示数据" : "Seed demo data"}</p>
            <p className="mt-1 text-sm text-[#435443]">
              {locale === "zh"
                ? "把家庭、管理员与学习者的演示记录写入 Postgres。"
                : "Insert the family, admin, and learner demo records into Postgres."}
            </p>
          </div>
          <button
            type="submit"
            disabled={seedPending}
            className="rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
          >
            {seedPending
              ? locale === "zh"
                ? "写入中..."
                : "Seeding..."
              : locale === "zh"
                ? "写入演示数据"
                : "Seed Demo Data"}
          </button>
          {seedState.status !== "idle" ? (
            <p className={seedState.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
              {seedState.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

function StatusBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-[rgba(255,255,255,0.78)] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[#7f6f52]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1f2a1f]">{value}</p>
    </div>
  );
}

function formatIssueCode(issueCode: DatabaseOpsCardProps["status"]["issueCode"], locale: Locale) {
  switch (issueCode) {
    case "none":
      return locale === "zh" ? "无" : "None";
    case "missing":
      return locale === "zh" ? "缺少 URL" : "Missing URL";
    case "unsupported":
      return locale === "zh" ? "引擎不符" : "Wrong Engine";
    case "network":
      return locale === "zh" ? "网络" : "Network";
    case "auth":
      return locale === "zh" ? "凭据" : "Credentials";
    case "database_missing":
      return locale === "zh" ? "数据库缺失" : "DB Missing";
    default:
      return locale === "zh" ? "未知" : "Unknown";
  }
}

interface DatabaseOpsCardProps {
  locale: Locale;
  status: DatabaseAdminStatus;
}
