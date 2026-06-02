import { HelpCircle, Plus, Info } from "lucide-react";
import { useSession } from "@/lib/careershield/session";

export function PageHeader({ title, icon: Icon }: { title: string; icon?: React.ComponentType<{ className?: string }> }) {
  const { currentSessionId, newAnalysis } = useSession();
  return (
    <div className="border-b border-border bg-card">
      <header className="flex items-center justify-between px-6 lg:px-10 py-5">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
          ) : null}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => newAnalysis()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-brand text-brand text-sm font-semibold hover:bg-brand-soft transition"
          >
            <Plus className="w-4 h-4" /> New Analysis
          </button>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Session: <span className="text-brand font-semibold">{currentSessionId}</span>
          </span>
          <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand transition">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>
      {/* Session save notice */}
      <div className="px-6 lg:px-10 pb-3">
        <div
          className="rounded-lg px-3 py-2 flex items-start gap-2 text-xs"
          style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1E40AF" }}
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Current analysis is not saved yet.</span>{" "}
            <span className="text-muted-foreground">Click "New Analysis" to save the current session and start a new one.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
