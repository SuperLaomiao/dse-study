import type { ReactNode } from "react";

export default function PageCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--stroke-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-[6px] md:rounded-[30px] md:p-6">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-[var(--foreground)] md:text-[1.3rem]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm text-[var(--text-muted)] md:mt-4 md:text-[15px]">
        {children}
      </div>
    </section>
  );
}
