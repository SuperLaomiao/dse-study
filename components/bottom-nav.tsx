import { learnerNavItems } from "@/lib/routes";

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav
      aria-label="Primary"
      className="mt-auto border-t border-[var(--stroke-soft)] pt-4 md:border-t-0 md:pt-2"
    >
      <ul className="grid grid-cols-4 gap-2 rounded-[28px] border border-[var(--stroke-soft)] bg-[rgba(255,250,243,0.84)] p-2 shadow-[0_16px_30px_rgba(66,51,27,0.08)] md:grid-cols-4">
        {learnerNavItems.map((item) => {
          const active = item.href === currentPath;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center justify-center rounded-2xl px-3 text-sm font-semibold transition-all md:min-h-14 md:text-[15px] ${
                  active
                    ? "bg-[var(--brand)] text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.22)]"
                    : "bg-[rgba(255,255,255,0.95)] text-[var(--brand)] hover:bg-[var(--cream)]"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
