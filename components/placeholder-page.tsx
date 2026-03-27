import type { ReactNode } from "react";

import AppShell from "@/components/app-shell";
import PageCard from "@/components/page-card";
import type { UserRole } from "@/lib/types";

export default function PlaceholderPage({
  role,
  title,
  description,
  currentPath,
  sections
}: {
  role: UserRole;
  title: string;
  description: string;
  currentPath?: string;
  sections: Array<{ title: string; content: ReactNode }>;
}) {
  return (
    <AppShell
      role={role}
      title={title}
      description={description}
      currentPath={currentPath}
    >
      {sections.map((section) => (
        <PageCard key={section.title} title={section.title}>
          {section.content}
        </PageCard>
      ))}
    </AppShell>
  );
}
