"use client";

import { useActionState } from "react";

import {
  bootstrapDatabaseAction,
  seedDatabaseAction
} from "@/app/actions/database-admin";
import { idleDatabaseActionState } from "@/lib/action-states";
import type { DatabaseAdminStatus } from "@/lib/database-admin";

export default function DatabaseOpsCard({ status }: DatabaseOpsCardProps) {
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
        <p className="text-xs uppercase tracking-[0.2em] text-[#7f6f52]">Current status</p>
        <p className="mt-2 text-base font-semibold text-[#1f2a1f]">{status.summary}</p>
        <p className="mt-2 text-sm text-[#435443]">{status.nextStep}</p>
        <p className="mt-2 text-xs leading-5 text-[#6c755e]">{status.detail}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <StatusBlock
            label="Connectivity"
            value={
              status.connectivity === "connected"
                ? "Connected"
                : status.connectivity === "unreachable"
                  ? "Unreachable"
                  : "Demo"
            }
          />
          <StatusBlock label="Mode" value={status.mode === "database" ? "Database" : "Demo"} />
          <StatusBlock label="Schema" value={status.schemaReady ? "Ready" : "Missing"} />
          <StatusBlock label="Seed" value={status.seeded ? "Present" : "Missing"} />
          <StatusBlock label="Issue" value={formatIssueCode(status.issueCode)} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <form action={bootstrapAction} className="space-y-3 rounded-[24px] border border-[rgba(31,42,31,0.08)] p-4">
          <div>
            <p className="font-medium text-[#1f2a1f]">Bootstrap schema</p>
            <p className="mt-1 text-sm text-[#435443]">
              Run Prisma `db push` against the configured Neon database.
            </p>
          </div>
          <button
            type="submit"
            disabled={bootstrapPending}
            className="rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
          >
            {bootstrapPending ? "Bootstrapping..." : "Bootstrap Schema"}
          </button>
          {bootstrapState.status !== "idle" ? (
            <p className={bootstrapState.status === "error" ? "text-sm text-[#9f3a28]" : "text-sm text-[#2f5f3c]"}>
              {bootstrapState.message}
            </p>
          ) : null}
        </form>

        <form action={seedAction} className="space-y-3 rounded-[24px] border border-[rgba(31,42,31,0.08)] p-4">
          <div>
            <p className="font-medium text-[#1f2a1f]">Seed demo data</p>
            <p className="mt-1 text-sm text-[#435443]">
              Insert the family, admin, and learner demo records into Postgres.
            </p>
          </div>
          <button
            type="submit"
            disabled={seedPending}
            className="rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
          >
            {seedPending ? "Seeding..." : "Seed Demo Data"}
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

function formatIssueCode(issueCode: DatabaseOpsCardProps["status"]["issueCode"]) {
  switch (issueCode) {
    case "none":
      return "None";
    case "missing":
      return "Missing URL";
    case "unsupported":
      return "Wrong Engine";
    case "network":
      return "Network";
    case "auth":
      return "Credentials";
    case "database_missing":
      return "DB Missing";
    default:
      return "Unknown";
  }
}

interface DatabaseOpsCardProps {
  status: DatabaseAdminStatus;
}
