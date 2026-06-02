import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DonutChart } from "@/components/careershield/DonutChart";
import { WorkflowSteps } from "@/components/careershield/WorkflowSteps";
import { useSession } from "@/lib/careershield/session";
import { ROLES, ROLE_SKILL_MAP } from "@/lib/careershield/mock-data";
import { Search, X, Users, AlertTriangle, BarChart3, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/skill-gap")({
  head: () => ({ meta: [{ title: "Skill Gap Analysis — CareerShield AI" }] }),
  component: SkillGapPage,
});

function SkillGapPage() {
  const navigate = useNavigate();
  const { skillGapResult, setSkillGapResult, addHistory } = useSession();
  const [role, setRole] = useState("Backend Developer");
  const [skills, setSkills] = useState<string[]>(["Java", "Spring Boot", "SQL", "Git", "REST APIs"]);
  const [input, setInput] = useState("");

  const addSkill = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (!skills.includes(v)) setSkills([...skills, v]);
    setInput("");
  };

  const analyze = () => {
    if (skills.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }
    const required = ROLE_SKILL_MAP[role] ?? [];
    const matched = skills.filter((s) => required.includes(s));
    const missing = required.filter((s) => !skills.includes(s));
    const partial = skills.filter((s) => !required.includes(s)).slice(0, 3);
    const total = required.length || 25;
    const matchScore = Math.round((matched.length / total) * 100);
    const result = { role, matchScore, matched, partial, missing };
    setSkillGapResult(result);
    addHistory({
      type: "Skill Gap",
      riskLevel: matchScore >= 70 ? "Low" : matchScore >= 40 ? "Medium" : "High",
      riskScore: 100 - matchScore,
      skillMatch: matchScore,
      missingSkillsCount: missing.length,
      missingSkills: missing,
      recommendations: missing.slice(0, 3),
      status: "In Progress",
      summary: `${role} • ${matchScore}% match`,
    });
    toast.success("Skill gap analyzed");
  };

  return (
    <AppShell title="Skill Gap Analysis" icon={Search}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Skill Gap Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Enter your role and current skills to discover the gap between your skills and what the market demands.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="rounded-2xl bg-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="font-semibold text-lg">Enter Your Details</h3>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Job Role / Designation <span className="text-danger">*</span></span>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border text-sm">
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <div className="mt-4">
              <span className="text-xs font-semibold">Your Current Skills <span className="text-danger">*</span></span>
              <div className="mt-1 rounded-lg border border-border p-2 flex flex-wrap gap-2 min-h-[120px]">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-soft text-brand text-xs font-medium">
                    {s}
                    <button onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(input.replace(",", "")); }
                  }}
                  placeholder="Type or select your skills"
                  className="flex-1 min-w-[150px] px-2 py-1 text-sm outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 text-xs text-blue-700 flex gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <div><span className="font-semibold">Tip:</span> Enter skills separated by commas or select from suggestions. Example: Java, SQL, Spring Boot, AWS</div>
            </div>
            <button onClick={analyze} className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-md">
              <Search className="w-4 h-4" /> Analyze Skill Gap
            </button>
          </div>

          {/* Result */}
          <div className="rounded-2xl bg-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="font-semibold text-lg">Analysis Results</h3>
            </div>
            {!skillGapResult ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Run skill gap analysis to see results.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <DonutChart
                    size={200}
                    slices={[
                      { value: skillGapResult.matched.length, color: "#22c55e", label: "Matched" },
                      { value: skillGapResult.partial.length, color: "#f59e0b", label: "Partial" },
                      { value: skillGapResult.missing.length, color: "#ef4444", label: "Missing" },
                    ]}
                    centerLabel={`${skillGapResult.matchScore}%`}
                    centerSub="Match Score"
                  />
                  <div className="space-y-2 text-sm">
                    <LegendRow color="#22c55e" label="Matched Skills" value={`${skillGapResult.matched.length} (${skillGapResult.matchScore}%)`} />
                    <LegendRow color="#f59e0b" label="Partial Match" value={`${skillGapResult.partial.length}`} />
                    <LegendRow color="#ef4444" label="Missing Skills" value={`${skillGapResult.missing.length}`} />
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-success-soft/50 p-3 text-sm text-success font-medium flex items-center gap-2">
                  🎉 You are doing good! Keep improving.
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <MiniStat icon={Users} label="Matched Skills" value={skillGapResult.matched.length} total={25} pct={skillGapResult.matchScore} color="success" />
                  <MiniStat icon={AlertTriangle} label="Partial Match" value={skillGapResult.partial.length} total={25} pct={12} color="warning" />
                  <MiniStat icon={BarChart3} label="Missing Skills" value={skillGapResult.missing.length} total={25} pct={20} color="danger" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg border border-border p-3">
                    <h4 className="text-sm font-semibold text-success mb-2">Your Current Skills ({skills.length})</h4>
                    <ul className="space-y-1 text-xs">
                      {skills.slice(0, 5).map((s) => <li key={s} className="flex items-center gap-2"><span className="text-success">✓</span> {s}</li>)}
                      {skills.length > 5 && <li className="text-success font-semibold">+{skills.length - 5} more</li>}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <h4 className="text-sm font-semibold text-danger mb-2">Skills You're Missing ({skillGapResult.missing.length})</h4>
                    <ul className="space-y-1 text-xs">
                      {skillGapResult.missing.slice(0, 5).map((s) => <li key={s} className="flex items-center gap-2"><span className="text-danger">●</span> {s}</li>)}
                      {skillGapResult.missing.length > 5 && <li className="text-danger font-semibold">+{skillGapResult.missing.length - 5} more</li>}
                    </ul>
                  </div>
                </div>
                <button onClick={() => navigate({ to: "/recommendations" })} className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-gradient text-white font-semibold">
                  Get Recommendations <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <WorkflowSteps
          steps={[
            { label: "Risk Prediction", status: "completed" },
            { label: "Skill Gap Analysis", status: "current", sub: "You are here" },
            { label: "Skill Recommendations", status: "pending", sub: "Get personalized suggestions" },
            { label: "Dashboard", status: "pending", sub: "View complete summary" },
          ]}
        />
      </div>
    </AppShell>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: color }} /> <span>{label}</span></div>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, total, pct, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; total: number; pct: number; color: "success" | "warning" | "danger" }) {
  const map = { success: "text-success bg-success-soft", warning: "text-warning bg-warning-soft", danger: "text-danger bg-danger-soft" };
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className={`w-4 h-4 ${map[color].split(" ")[0]}`} /> {label}</div>
      <div className={`text-xl font-bold mt-1 ${map[color].split(" ")[0]}`}>{value} <span className="text-sm font-normal text-muted-foreground">/ {total}</span></div>
      <div className="text-[10px] text-muted-foreground">{pct}%</div>
    </div>
  );
}
