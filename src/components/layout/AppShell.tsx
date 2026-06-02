import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";
import type { ReactNode } from "react";

export function AppShell({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PageHeader title={title} icon={icon} />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
