import type { ReactNode } from "react";

export default function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[rgba(46,87,60,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f5f3c]">
      {children}
    </span>
  );
}
