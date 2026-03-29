import type { ReactNode } from "react";

export default function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--stroke-soft)] bg-[var(--brand-tint)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      {children}
    </span>
  );
}
