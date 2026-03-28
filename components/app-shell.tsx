import type { ReactNode } from "react";

import BottomNav from "@/components/bottom-nav";
import StatusPill from "@/components/status-pill";
import type { UserRole } from "@/lib/types";

export default function AppShell({
  role,
  title,
  description,
  currentPath,
  children
}: {
  role: UserRole;
  title: string;
  description: string;
  currentPath?: string;
  children: ReactNode;
}) {
  const roleLabel =
    role === "admin" ? "Family Admin" : role === "learner" ? "Learner" : "Public";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 text-[#1f2a1f] md:max-w-4xl md:px-6 md:py-8">
      <header className="rounded-[32px] bg-[rgba(255,248,239,0.86)] p-5 shadow-[0_20px_40px_rgba(73,56,27,0.08)] md:rounded-[36px] md:p-7">
        <div className="flex items-start justify-between gap-3 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7f6f52]">
              DSE Study
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
          </div>
          <StatusPill>{roleLabel}</StatusPill>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#586857] md:mt-4 md:text-[15px]">
          {description}
        </p>
      </header>
      <div className="mt-4 flex flex-1 flex-col gap-4 md:mt-5 md:gap-5">{children}</div>
      {role === "learner" ? <BottomNav currentPath={currentPath ?? "/home"} /> : null}
    </main>
  );
}
