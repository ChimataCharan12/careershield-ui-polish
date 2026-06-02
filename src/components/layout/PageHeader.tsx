import { HelpCircle, User } from "lucide-react";
import { useSession } from "@/lib/careershield/session";

export function PageHeader({ title, icon: Icon }: { title: string; icon?: React.ComponentType<{ className?: string }> }) {
  const { currentSessionId } = useSession();
  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:block">
          Session: <span className="text-brand font-semibold">{currentSessionId}</span>
        </span>
        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand transition">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand transition">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
