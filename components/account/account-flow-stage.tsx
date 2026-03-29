import type { ReactNode } from "react";

export default function AccountFlowStage({
  step,
  title,
  description,
  actions
}: {
  step: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-5 shadow-[0_18px_34px_rgba(52,42,23,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">{step}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
