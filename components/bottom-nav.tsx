import { learnerNavItems } from "@/lib/routes";

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav
      aria-label="Primary"
      className="mt-auto border-t border-[rgba(31,42,31,0.08)] pt-4 md:border-t-0 md:pt-2"
    >
      <ul className="grid grid-cols-4 gap-2 md:grid-cols-4 md:rounded-[28px] md:bg-[rgba(255,248,239,0.78)] md:p-2">
        {learnerNavItems.map((item) => {
          const active = item.href === currentPath;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`flex min-h-12 items-center justify-center rounded-2xl px-3 text-sm font-medium transition-colors md:min-h-14 md:text-[15px] ${
                  active
                    ? "bg-[#23402b] text-[#f7f3ea]"
                    : "bg-[rgba(255,255,255,0.75)] text-[#314531]"
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
