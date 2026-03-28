import type { ReactNode } from "react";

export default function PageCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(31,42,31,0.08)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_18px_45px_rgba(57,44,24,0.08)] md:rounded-[30px] md:p-6">
      <h2 className="text-lg font-semibold text-[#1f2a1f] md:text-[1.3rem]">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-[#435443] md:mt-4 md:text-[15px]">{children}</div>
    </section>
  );
}
