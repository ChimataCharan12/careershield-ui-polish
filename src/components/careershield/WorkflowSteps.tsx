import { Check } from "lucide-react";

export interface WorkflowStep {
  label: string;
  status: "completed" | "current" | "pending";
  sub?: string;
}

export function WorkflowSteps({ steps, title = "Guided Workflow" }: { steps: WorkflowStep[]; title?: string }) {
  return (
    <div className="rounded-2xl bg-card shadow-card p-6">
      <h3 className="text-sm font-semibold text-brand mb-4">{title}</h3>
      <div className="flex items-center gap-2 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 min-w-[180px]">
            <div
              className={`flex items-center gap-3 p-3 rounded-xl flex-1 ${
                s.status === "current"
                  ? "bg-brand-soft border border-brand/20"
                  : s.status === "completed"
                  ? "bg-success-soft/40"
                  : "bg-muted"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.status === "completed"
                    ? "bg-success text-white"
                    : s.status === "current"
                    ? "bg-brand text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {s.status === "completed" ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{s.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {s.sub ?? (s.status === "completed" ? "Completed" : s.status === "current" ? "You are here" : "Pending")}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && <div className="text-muted-foreground text-xl px-1">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
