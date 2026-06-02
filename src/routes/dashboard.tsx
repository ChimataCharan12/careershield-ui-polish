import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DonutChart } from "@/components/careershield/DonutChart";
import { GaugeChart } from "@/components/careershield/GaugeChart";
import { useSession } from "@/lib/careershield/session";
import { BarChart3, Shield, Search as SearchIcon, Settings, Rocket, Target, Bell, CheckCircle2, ChevronRight, Trash2, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerShield AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { history, riskResult, skillGapResult, currentSessionId } = useSession();

  const score = riskResult?.score ?? 82;
  const level = riskResult?.level ?? "High";
  const match = skillGapResult?.matchScore ?? 68;
  const missing = skillGapResult?.missing.length ?? 8;

  const recent = useMemo(() => history.slice(0, 20), [history]);

  return (
    <AppShell title="Analysis Dashboard" icon={BarChart3}>
      <div className="max-w-[1500px] mx-auto space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-3xl font-bold">Analysis Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Overview of your career risk, skills and recommendations</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center"><Bell className="w-4 h-4 text-muted-foreground" /></button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">U</div>
              <div className="text-sm"><div className="font-semibold">User</div><div className="text-xs text-muted-foreground">Professional</div></div>
            </div>
          </div>
        </div>

        {/* Current Summary */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Current Analysis Summary</h3>
              <span className="px-2 py-0.5 rounded-md bg-brand-soft text-brand text-xs font-semibold">Session: {currentSessionId}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Here's your complete analysis overview. Keep learning and improve your career growth!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Risk Analysis */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Shield className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">1. Risk Analysis</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-danger-soft text-danger font-semibold">{level} Risk</span>
                </div>
              </div>
              <div className="flex justify-center"><GaugeChart score={score} size={180} /></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-danger">{score} <span className="text-sm font-normal text-muted-foreground">/ 100</span></div>
                <div className="text-[10px] text-muted-foreground">Confidence Score: 82%</div>
                <div className="mt-2 text-[10px] text-danger bg-danger-soft/50 p-2 rounded-lg">High probability of layoff in the near future based on current indicators.</div>
              </div>
            </div>
            {/* Skill Gap */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><SearchIcon className="w-5 h-5" /></div>
                <div className="font-bold text-sm">2. Skill Gap Analysis</div>
              </div>
              <div className="flex justify-center">
                <DonutChart
                  size={160}
                  slices={[
                    { value: 68, color: "#22c55e", label: "" },
                    { value: 12, color: "#f59e0b", label: "" },
                    { value: 20, color: "#ef4444", label: "" },
                  ]}
                  centerLabel={`${match}%`}
                  centerSub="Match Score"
                />
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <LegendRow color="#22c55e" label="Matched Skills" v="17 (68%)" />
                <LegendRow color="#f59e0b" label="Partial Match" v="3 (12%)" />
                <LegendRow color="#ef4444" label="Missing Skills" v={`${missing} (20%)`} />
              </div>
              <div className="mt-2 text-[10px] text-success bg-success-soft/50 p-2 rounded-lg text-center">🎉 You are doing good! Keep improving.</div>
            </div>
            {/* Recommended */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Settings className="w-5 h-5" /></div>
                <div className="font-bold text-sm">3. Recommended Skills</div>
              </div>
              <div className="text-xs font-semibold mb-2">Top Recommendations</div>
              {[
                { name: "AWS", level: "High Demand" },
                { name: "Docker", level: "High Demand" },
                { name: "Kubernetes", level: "Medium Demand" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
                  <span className="text-sm font-medium">⚙ {s.name}</span>
                  <span className="text-xs text-success">↗ {s.level}</span>
                </div>
              ))}
              <button onClick={() => navigate({ to: "/recommendations" })} className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-brand text-brand text-xs font-semibold">
                View All Recommendations →
              </button>
            </div>
            {/* Next Step */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Rocket className="w-5 h-5" /></div>
                <div className="font-bold text-sm">Next Step (Guided)</div>
              </div>
              {[
                { n: 1, label: "Risk Prediction", sub: "Completed", done: true },
                { n: 2, label: "Skill Gap Analysis", sub: "Completed", done: true },
                { n: 3, label: "Skill Recommendations", sub: "Completed", done: true },
                { n: 4, label: "Dashboard", sub: "You are here", done: false },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3 py-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done ? "bg-success-soft text-success" : "bg-brand text-white"}`}>{s.n}</div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${s.done ? "" : "text-brand"}`}>{s.label}</div>
                    <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                  </div>
                  {s.done && <CheckCircle2 className="w-4 h-4 text-success" />}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight + Progress */}
          <div className="grid lg:grid-cols-2 gap-5 mt-5">
            <div className="rounded-xl border border-border p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Target className="w-5 h-5" /></div>
              <div>
                <h4 className="text-sm font-bold text-brand">AI Insight</h4>
                <p className="text-xs text-muted-foreground mt-1">Your risk is high, but good news! By learning AWS, Docker and Kubernetes, you can significantly improve your employability and reduce your layoff risk.</p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-4 flex items-center gap-4">
              <DonutChart size={80} thickness={10} slices={[{ value: 75, color: "#5b21ff", label: "" }, { value: 25, color: "#e2e8f0", label: "" }]} centerLabel="75%" />
              <div>
                <h4 className="text-sm font-bold">Overall Progress</h4>
                <p className="text-xs text-muted-foreground">Great job! You're on the right track.</p>
                <p className="text-xs text-brand font-semibold mt-1">Keep going! 🚀</p>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-xl font-bold">Analysis History</h3>
              <p className="text-xs text-muted-foreground">View your previous analyses and track your progress over time.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Search sessions..." className="pl-9 pr-3 py-2 rounded-lg border border-border text-sm w-56" />
              </div>
              <button className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm"><Filter className="w-4 h-4" /> Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  {["Session ID", "Date & Time", "Risk Level", "Skill Match", "Missing Skills", "Recommendations", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No analyses yet. Run a Risk Prediction or Skill Gap analysis to populate history.</td></tr>
                )}
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-3 px-2 font-semibold">{r.id} {r.id === currentSessionId && <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-soft text-brand">Current</span>}</td>
                    <td className="py-3 px-2"><div>{r.date}</div><div className="text-xs text-muted-foreground">{r.time}</div></td>
                    <td className="py-3 px-2"><span className={`font-semibold ${r.riskLevel === "High" ? "text-danger" : r.riskLevel === "Medium" ? "text-warning" : "text-success"}`}>{r.riskLevel} Risk</span><div className="text-xs text-muted-foreground">{r.riskScore}/100</div></td>
                    <td className="py-3 px-2"><div className="font-semibold">{r.skillMatch}%</div><div className="text-xs text-muted-foreground">{r.skillMatch >= 70 ? "Good Match" : r.skillMatch >= 40 ? "Average Match" : "—"}</div></td>
                    <td className="py-3 px-2 text-danger font-semibold">{r.missingSkillsCount} Skills<div className="text-xs text-muted-foreground font-normal">{r.missingSkills.slice(0, 3).join(", ") || "—"}</div></td>
                    <td className="py-3 px-2">{r.recommendations.length} Skills<div className="text-xs text-muted-foreground">{r.recommendations.slice(0, 3).join(", ") || "—"}</div></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === "Completed" ? "bg-success-soft text-success" : "bg-brand-soft text-brand"}`}>{r.status}</span></td>
                    <td className="py-3 px-2"><div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg border border-brand text-brand text-xs font-semibold">View Details</button><button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3 text-xs text-muted-foreground">
            <div>Showing 1 to {recent.length} of {recent.length} sessions</div>
            <div className="flex items-center gap-2">Show <select className="px-2 py-1 rounded border border-border"><option>10</option><option>20</option></select> per page</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function LegendRow({ color, label, v }: { color: string; label: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} /> {label}</div>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
