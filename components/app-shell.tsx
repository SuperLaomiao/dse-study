import type { ReactNode } from "react";

import BottomNav from "@/components/bottom-nav";
import LanguageToggle from "@/components/language-toggle";
import StatusPill from "@/components/status-pill";
import { pickLocale, type Locale } from "@/lib/i18n/config";
import { getAdminNavItems } from "@/lib/routes";
import type { UserRole } from "@/lib/types";

export default function AppShell({
  locale,
  role,
  title,
  description,
  currentPath,
  children
}: {
  locale: Locale;
  role: UserRole;
  title: string;
  description: string;
  currentPath?: string;
  children: ReactNode;
}) {
  const roleLabel =
    role === "admin"
      ? pickLocale(locale, { zh: "家庭管理", en: "Family Admin" })
      : role === "learner"
        ? pickLocale(locale, { zh: "学习者", en: "Learner" })
        : pickLocale(locale, { zh: "公开页", en: "Public" });
  const adminNavItems = getAdminNavItems(locale);
  const appLabel = pickLocale(locale, { zh: "DSE 学习", en: "DSE Study" });
  const signOutLabel = pickLocale(locale, { zh: "退出登录", en: "Sign out" });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 text-[#1f2a1f] md:max-w-4xl md:px-6 md:py-8">
      <header className="rounded-[32px] border border-[var(--stroke-soft)] bg-[linear-gradient(180deg,rgba(255,251,245,0.96),rgba(248,241,230,0.88))] p-5 shadow-[var(--shadow-soft)] backdrop-blur-[6px] md:rounded-[36px] md:p-7">
        <div className="flex items-start justify-between gap-3 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-soft)]">
              {appLabel}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">{title}</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LanguageToggle locale={locale} />
            {role === "admin" ? (
              <a href="/admin/family">
                <StatusPill>{roleLabel}</StatusPill>
              </a>
            ) : (
              <StatusPill>{roleLabel}</StatusPill>
            )}
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] md:mt-4 md:text-[15px]">
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
                      ? "bg-[var(--brand)] text-[var(--cream)] shadow-[0_12px_24px_rgba(35,64,43,0.2)]"
                      : "border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.84)] text-[var(--brand)] hover:bg-[var(--cream)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <form action="/api/account/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex rounded-full border border-[var(--stroke-soft)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-[rgba(255,255,255,0.5)]"
              >
                {signOutLabel}
              </button>
            </form>
          </div>
        ) : null}
      </header>
      <div className="mt-4 flex flex-1 flex-col gap-4 md:mt-5 md:gap-5">{children}</div>
      {role === "learner" ? <BottomNav currentPath={currentPath ?? "/home"} locale={locale} /> : null}
    </main>
  );
}
