import type { ReactNode } from "react";

import BottomNav from "@/components/bottom-nav";
import StatusPill from "@/components/status-pill";
import { adminNavItems } from "@/lib/routes";
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
          {role === "admin" ? (
            <a href="/admin/family">
              <StatusPill>{roleLabel}</StatusPill>
            </a>
          ) : (
            <StatusPill>{roleLabel}</StatusPill>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#586857] md:mt-4 md:text-[15px]">
          {description}
        </p>
        {role === "admin" ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {adminNavItems.map((item) => {
              const active = item.href === currentPath;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#23402b] text-[#f7f3ea]"
                      : "bg-[rgba(255,255,255,0.78)] text-[#314531]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <form action="/api/account/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex rounded-full border border-[rgba(31,42,31,0.12)] bg-transparent px-4 py-2 text-sm font-semibold text-[#314531]"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : null}
      </header>
      <div className="mt-4 flex flex-1 flex-col gap-4 md:mt-5 md:gap-5">{children}</div>
      {role === "learner" ? <BottomNav currentPath={currentPath ?? "/home"} /> : null}
    </main>
  );
}
