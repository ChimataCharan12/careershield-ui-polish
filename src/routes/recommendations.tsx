import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkflowSteps } from "@/components/careershield/WorkflowSteps";
import { DonutChart } from "@/components/careershield/DonutChart";
import { useSession } from "@/lib/careershield/session";
import { Star, ExternalLink, TrendingUp, Shield, Rocket, Edit2, User, CheckCircle2, AlertTriangle, Info, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Skill Recommendations — CareerShield AI" }] }),
  component: RecommendationsPage,
});

const HIGH_PRIORITY = [
  { name: "AWS", desc: "Cloud computing platform", demand: "High", impact: "High" },
  { name: "Docker", desc: "Containerization platform", demand: "High", impact: "High" },
  { name: "Kubernetes", desc: "Container orchestration", demand: "High", impact: "High" },
];
const MEDIUM_PRIORITY = [
  { name: "System Design", desc: "System architecture & design", demand: "Medium", impact: "Medium" },
  { name: "Redis", desc: "In-memory data structure store", demand: "Medium", impact: "Medium" },
];
const GROWTH = [{ name: "GraphQL", desc: "Query language for APIs", demand: "Emerging", impact: "Low" }];

function RecommendationsPage() {
  const navigate = useNavigate();
  const { skillGapResult } = useSession();
  const role = skillGapResult?.role ?? "Backend Developer";
  const match = skillGapResult?.matchScore ?? 65;
  const missing = skillGapResult?.missing.length ?? 7;
  const riskLevel = match >= 70 ? "Low" : match >= 40 ? "Medium" : "High";

  return (
    <AppShell title="Skill Recommendations" icon={Star}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Skill Recommendations</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your role, skill gaps and market demand, here are the top skills we recommend you to learn next.
          </p>
        </div>

        {/* Top banner */}
        <div className="rounded-2xl bg-success-soft/40 p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-success">Recommendations generated from your Skill Gap Analysis</h3>
              <span className="px-2 py-0.5 rounded-md bg-danger-soft text-danger text-xs font-semibold">{riskLevel} Risk Profile</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">These skills are prioritized based on your missing skills, current role, market demand and risk level.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Pill icon={User} label={`Role: ${role}`} />
              <Pill icon={CheckCircle2} label="Skill Match:" value={`${match}%`} color="text-brand" />
              <Pill icon={AlertTriangle} label="Missing Skills:" value={String(missing)} color="text-warning" />
              <Pill icon={Shield} label="Risk Level:" value={riskLevel} color="text-danger" />
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs"><User className="w-4 h-4" /> Your Role</div>
            <div className="text-lg font-bold mt-2">{role}</div>
            <button className="mt-2 text-xs text-brand inline-flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit Role</button>
          </div>
          <div className="rounded-2xl bg-card shadow-card p-5 flex items-center gap-3">
            <DonutChart size={70} thickness={10} slices={[{ value: match, color: "#5b21ff", label: "" }, { value: 100 - match, color: "#e2e8f0", label: "" }]} centerLabel={`${match}%`} />
            <div>
              <div className="text-sm font-semibold">Skill Match Score</div>
              <div className="text-success text-sm font-semibold">Good Match</div>
              <div className="text-[10px] text-muted-foreground">Keep learning to bridge the gaps!</div>
            </div>
          </div>
          <div className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center gap-2 text-warning text-xs"><AlertTriangle className="w-4 h-4" /> Missing Skills Identified</div>
            <div className="text-3xl font-bold mt-2">{missing}</div>
            <div className="text-xs text-muted-foreground">Skills to improve</div>
          </div>
          <div className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center gap-2 text-brand text-xs font-semibold mb-2"><Info className="w-4 h-4" /> How Recommendations Work</div>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>✓ We analyze market demand and your skill gaps</li>
              <li>✓ High risk = In-demand skills are prioritized</li>
              <li>✓ Low risk = Growth skills are suggested</li>
              <li>✓ Skills are updated regularly</li>
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Skills list */}
          <div className="rounded-2xl bg-card shadow-card p-6">
            <h3 className="font-bold text-lg">Recommended Skills <span className="text-xs text-muted-foreground font-normal">(Ranked by Priority)</span></h3>
            <div className="mt-5 space-y-5">
              <PrioritySection color="danger" title="High Priority" subtitle="Learn First" skills={HIGH_PRIORITY} />
              <PrioritySection color="warning" title="Medium Priority" subtitle="Next in Line" skills={MEDIUM_PRIORITY} />
              <PrioritySection color="success" title="Growth Skills" subtitle="Future Ready" skills={GROWTH} />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Click on any skill to view learning resources and roadmap
            </p>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-brand" /> Why These Skills?</h3>
              <div className="space-y-3 text-xs">
                <ReasonRow icon={TrendingUp} color="success" title="High Market Demand" desc="These skills are trending in 85%+ of job postings for Backend Developer." />
                <ReasonRow icon={Shield} color="brand" title="Reduce Layoff Risk" desc="Professionals with these skills are 60% less likely to be affected in layoffs." />
                <ReasonRow icon={Rocket} color="recommend" title="Boost Career Growth" desc="Learning these skills can increase your salary potential by 25-35%." />
              </div>
            </div>
            <div className="rounded-2xl bg-brand-soft/40 p-5">
              <h3 className="font-bold text-sm flex items-center gap-2"><Rocket className="w-4 h-4 text-brand" /> Next Step</h3>
              <p className="text-xs text-muted-foreground mt-1">Start learning these skills to improve your profile and reduce your career risk.</p>
              <button onClick={() => navigate({ to: "/dashboard" })} className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-semibold">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <WorkflowSteps
          steps={[
            { label: "Risk Prediction", status: "completed" },
            { label: "Skill Gap Analysis", status: "completed" },
            { label: "Skill Recommendations", status: "current", sub: "You are here" },
            { label: "Dashboard", status: "pending", sub: "View complete summary" },
          ]}
        />
      </div>
    </AppShell>
  );
}

function Pill({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string; color?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card text-xs">
      <Icon className={`w-3.5 h-3.5 ${color ?? "text-muted-foreground"}`} />
      <span className="text-muted-foreground">{label}</span>
      {value && <span className={`font-bold ${color ?? "text-foreground"}`}>{value}</span>}
    </div>
  );
}

function PrioritySection({ color, title, subtitle, skills }: { color: "danger" | "warning" | "success"; title: string; subtitle: string; skills: { name: string; desc: string; demand: string; impact: string }[] }) {
  const map = {
    danger: { bg: "#FFF1F2", text: "#DC2626" },
    warning: { bg: "#FFFBEB", text: "#D97706" },
    success: { bg: "#F0FDF4", text: "#16A34A" },
  };
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4">
      <div className="rounded-lg p-3 self-start" style={{ backgroundColor: map[color].bg }}>
        <div className="font-semibold text-sm" style={{ color: map[color].text }}>{title}</div>
        <div className="text-[10px]" style={{ color: map[color].text, opacity: 0.75 }}>{subtitle}</div>
      </div>
      <div className="space-y-2">
        {skills.map((s) => (
          <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 border border-transparent hover:border-border">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-brand">{s.name.slice(0, 2).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
            <div className="text-xs hidden sm:block">
              <div className={`font-semibold ${s.demand === "High" ? "text-success" : s.demand === "Medium" ? "text-warning" : "text-brand"}`}>↗ {s.demand} Demand</div>
              <div className="text-muted-foreground">Impact: {s.impact}</div>
            </div>
            <a href="https://example.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand text-brand text-xs font-semibold">
              Learn Resources <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasonRow({ icon: Icon, color, title, desc }: { icon: React.ComponentType<{ className?: string }>; color: "success" | "brand" | "recommend"; title: string; desc: string }) {
  const map = { success: "bg-success-soft text-success", brand: "bg-brand-soft text-brand", recommend: "bg-recommend-soft text-recommend" };
  return (
    <div className="flex items-start gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${map[color]}`}><Icon className="w-4 h-4" /></div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
