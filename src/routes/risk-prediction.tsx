import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GaugeChart } from "@/components/careershield/GaugeChart";
import { DonutChart } from "@/components/careershield/DonutChart";
import { WorkflowSteps } from "@/components/careershield/WorkflowSteps";
import { useSession } from "@/lib/careershield/session";
import {
  INDUSTRIES, COUNTRIES, LOCATIONS, STAGES,
  computeRiskScore, generateBulkRows,
} from "@/lib/careershield/mock-data";
import { TrendingUp, Building2, Search as SearchIcon, FileText, Check, Info, Lightbulb, Download, ExternalLink, ArrowRight, X, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/risk-prediction")({
  head: () => ({ meta: [{ title: "Risk Prediction — CareerShield AI" }] }),
  component: RiskPredictionPage,
});

function RiskPredictionPage() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  return (
    <AppShell title="Risk Prediction" icon={TrendingUp}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Layoff Risk Prediction</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "single"
              ? "Enter company details to predict the likelihood of layoffs using our machine learning model."
              : "Analyze companies individually or upload a dataset to predict layoff risk for multiple records."}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <h3 className="text-sm font-semibold mb-4">Choose Analysis Type</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ModeCard active={mode === "single"} onClick={() => setMode("single")} title="Single Analysis" desc="Enter details manually to predict risk for one company." />
            <ModeCard active={mode === "bulk"} onClick={() => setMode("bulk")} title="Bulk Analysis (CSV Upload)" desc="Upload CSV file to analyze multiple companies at once." icon="csv" />
          </div>
        </div>

        {mode === "single" ? <SingleAnalysis /> : <BulkAnalysis />}
      </div>
    </AppShell>
  );
}

function ModeCard({ active, onClick, title, desc, icon }: { active: boolean; onClick: () => void; title: string; desc: string; icon?: "csv" }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-xl border-2 transition flex items-start gap-4 ${
        active ? "border-brand bg-brand-soft/40" : "border-border hover:border-brand/40"
      }`}
    >
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${active ? "border-brand" : "border-muted-foreground"}`}>
        {active && <div className="w-3 h-3 rounded-full bg-brand" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon === "csv" && <FileText className="w-4 h-4 text-brand" />}
          <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </button>
  );
}

function SingleAnalysis() {
  const navigate = useNavigate();
  const { setRiskResult, riskResult, addHistory } = useSession();
  const [form, setForm] = useState({
    industry: "", location: "", country: "", stage: "",
    funds: "", laidOffPct: "", laidOffCount: "",
  });

  const reset = () => {
    setForm({ industry: "", location: "", country: "", stage: "", funds: "", laidOffPct: "", laidOffCount: "" });
    setRiskResult(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry || !form.country || !form.stage) {
      toast.error("Please fill required fields");
      return;
    }
    const { score, level } = computeRiskScore({
      funds: Number(form.funds) || 0,
      laidOffPct: Number(form.laidOffPct) || 0,
      laidOffCount: Number(form.laidOffCount) || 0,
      stage: form.stage,
    });
    const result = {
      score,
      level,
      confidence: 82,
      factors: ["High percentage laid off", "Large number of layoffs", "Early stage company", "Low funds raised"],
    };
    setRiskResult(result);
    addHistory({
      type: "Risk Prediction",
      riskLevel: level,
      riskScore: score,
      skillMatch: 0,
      missingSkillsCount: 0,
      missingSkills: [],
      recommendations: [],
      status: "In Progress",
      summary: `${form.industry} • Risk ${level} (${score}/100)`,
    });
    toast.success("Prediction generated");
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
            <h3 className="font-semibold text-lg">Enter Company Details</h3>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Industry" required value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} options={INDUSTRIES} placeholder="Select Industry" />
              <Select label="Location HQ" required value={form.location} onChange={(v) => setForm({ ...form, location: v })} options={LOCATIONS} placeholder="Select Location" />
              <Select label="Country" required value={form.country} onChange={(v) => setForm({ ...form, country: v })} options={COUNTRIES} placeholder="Select Country" />
              <Select label="Stage" required value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} options={STAGES} placeholder="Select Stage" />
              <Input label="Funds Raised (USD)" required value={form.funds} onChange={(v) => setForm({ ...form, funds: v })} placeholder="Enter funds raised" type="number" />
              <Input label="Percentage Laid Off (%)" required value={form.laidOffPct} onChange={(v) => setForm({ ...form, laidOffPct: v })} placeholder="Enter percentage (0-100)" type="number" />
            </div>
            <Input label="Laid Off Count" required value={form.laidOffCount} onChange={(v) => setForm({ ...form, laidOffCount: v })} placeholder="Enter laid off count" type="number" />
            <div className="pt-2">
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-md hover:opacity-90">
                <TrendingUp className="w-4 h-4" /> Predict Layoff Risk
              </button>
            </div>
          </form>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <h3 className="font-semibold text-lg">Prediction Result</h3>
          </div>
          {!riskResult ? (
            <div className="text-center py-10">
              <div className="w-28 h-28 mx-auto rounded-full bg-brand-soft flex items-center justify-center">
                <SearchIcon className="w-12 h-12 text-brand" />
              </div>
              <h4 className="mt-5 text-xl font-bold">No Prediction Yet</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                Fill in the company details and click "Predict Layoff Risk" to see the result.
              </p>
              <div className="mt-6 rounded-xl bg-muted/50 p-4 text-left">
                <p className="text-xs font-semibold text-center mb-3">The system will analyze:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {["Industry", "Funds Raised", "Location HQ", "Percentage Laid Off", "Country", "Laid Off Count", "Stage", ""].map((x, i) => x && (
                    <div key={i} className="flex items-center gap-2"><Check className="w-3 h-3 text-success" /> {x}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col items-center">
                  <GaugeChart score={riskResult.score} />
                  <div className={`text-2xl font-bold mt-1 ${riskResult.level === "High" ? "text-danger" : riskResult.level === "Medium" ? "text-warning" : "text-success"}`}>
                    {riskResult.level} Risk
                  </div>
                  <div className="text-3xl font-bold text-danger mt-1">{riskResult.score} <span className="text-base font-normal text-muted-foreground">/ 100</span></div>
                  <div className="text-xs text-muted-foreground mt-1">Confidence Score: {riskResult.confidence}%</div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl bg-danger-soft/60 p-4">
                    <h5 className="text-sm font-semibold text-danger mb-1">Risk Level</h5>
                    <p className="text-base font-bold text-danger">{riskResult.level} Risk</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This company has a {riskResult.level.toLowerCase()} probability of layoffs based on historical data and current indicators.
                    </p>
                  </div>
                  <div className="rounded-xl bg-danger-soft/40 p-4">
                    <h5 className="text-sm font-semibold text-danger mb-2">Top Risk Factors</h5>
                    <ul className="space-y-1 text-xs">
                      {riskResult.factors.map((f) => (
                        <li key={f} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-warning-soft/40 p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-warning shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-warning">Recommendation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{riskResult.level === "High" ? "High risk detected. Consider upskilling and exploring new opportunities." : "Stay updated with market trends and keep learning."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      {riskResult ? (
        <div className="grid md:grid-cols-3 gap-4">
          <InfoCard color="success" icon={Check} title="Prediction Successful!" desc="Your layoff risk has been calculated using our machine learning model." />
          <InfoCard color="info" icon={Info} title="What's Next?" desc="Analyze your skill gap to identify missing skills and improve your career stability." cta={{ label: "Analyze Skill Gaps", onClick: () => navigate({ to: "/skill-gap" }) }} />
          <InfoCard color="warning" icon={Lightbulb} title="Why should I upskill?" desc="Professionals with in-demand skills are 3x less likely to be impacted by layoffs." />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <InfoCard color="success" icon={Check} title="How it works?" desc="Our model analyzes multiple factors including historical data, market trends, and company indicators." />
          <InfoCard color="info" icon={Info} title="What's Next?" desc="After risk prediction, you can analyze skill gaps and get personalized recommendations." />
          <InfoCard color="warning" icon={Lightbulb} title="Why should I upskill?" desc="Professionals with in-demand skills are 3x less likely to be impacted by layoffs." />
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-brand mb-3">Next Steps (Guided Workflow)</h3>
        <WorkflowSteps
          title=""
          steps={[
            { label: "Risk Prediction", status: riskResult ? "completed" : "current", sub: riskResult ? "Completed" : "You are here" },
            { label: "Skill Gap Analysis", status: "pending", sub: "Find your skill gaps" },
            { label: "Skill Recommendations", status: "pending", sub: "Get personalized suggestions" },
            { label: "Dashboard", status: "pending", sub: "View complete summary" },
          ]}
        />
      </div>
    </>
  );
}

function BulkAnalysis() {
  const navigate = useNavigate();
  const { bulkResult, setBulkResult, addHistory } = useSession();
  const [file, setFile] = useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f.name);
      toast.success(`Selected ${f.name}`);
    }
  };

  const analyze = () => {
    const rows = generateBulkRows(100);
    const high = rows.filter((r) => r.riskLevel === "High").length;
    const medium = rows.filter((r) => r.riskLevel === "Medium").length;
    const low = rows.filter((r) => r.riskLevel === "Low").length;
    setBulkResult({ total: rows.length, high, medium, low });
    addHistory({
      type: "Bulk Analysis",
      riskLevel: "High",
      riskScore: Math.round(rows.reduce((a, r) => a + r.riskScore, 0) / rows.length),
      skillMatch: 0,
      missingSkillsCount: 0,
      missingSkills: [],
      recommendations: [],
      status: "Completed",
      summary: `Bulk: ${rows.length} records analyzed`,
    });
    toast.success("Bulk analysis completed");
  };

  const downloadCsv = () => {
    const rows = generateBulkRows(100);
    const header = ["Company", "Industry", "Country", "Stage", "Funds", "LaidOffPct", "LaidOffCount", "RiskScore", "RiskLevel"];
    const body = rows.map((r) => [r.company, r.industry, r.country, r.stage, r.funds, r.laidOffPct, r.laidOffCount, r.riskScore, r.riskLevel].join(","));
    const csv = [header.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bulk-analysis-results.csv";
    a.click();
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <h3 className="font-semibold text-lg mb-1">Upload Dataset</h3>
          <p className="text-xs text-muted-foreground mb-4">Upload a CSV file containing company details.</p>
          <label className="block rounded-xl border-2 border-dashed border-brand/30 p-6 cursor-pointer hover:bg-brand-soft/30">
            <input type="file" accept=".csv" className="hidden" onChange={onFile} />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Upload className="w-5 h-5 text-brand" /></div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{file ?? "Drop your CSV file here"}</div>
                <div className="text-xs text-muted-foreground">{file ? "100 records detected" : "or click to browse"}</div>
              </div>
              <button type="button" className="text-xs text-brand font-semibold">{file ? "Change File" : "Browse"}</button>
            </div>
          </label>
          <button onClick={analyze} className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-md">
            <TrendingUp className="w-4 h-4" /> Analyze Dataset
          </button>
          <p className="text-[11px] text-muted-foreground mt-3">
            CSV columns required: Industry, Company Stage, Funding Level, Company Size, Location, Previous Layoffs
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-card shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Analysis Summary</h3>
            {bulkResult && <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-success-soft text-success">Completed</span>}
          </div>
          {!bulkResult ? (
            <p className="text-sm text-muted-foreground">Run analysis to see the summary.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total Records" value={bulkResult.total} sub="Analyzed Successfully" color="brand" />
                <StatCard label="High Risk" value={bulkResult.high} sub={`${((bulkResult.high / bulkResult.total) * 100).toFixed(1)}% of total`} color="danger" />
                <StatCard label="Medium Risk" value={bulkResult.medium} sub={`${((bulkResult.medium / bulkResult.total) * 100).toFixed(1)}% of total`} color="warning" />
                <StatCard label="Low Risk" value={bulkResult.low} sub={`${((bulkResult.low / bulkResult.total) * 100).toFixed(1)}% of total`} color="success" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <h4 className="text-xs font-semibold mb-2">Risk Distribution</h4>
                  <DonutChart
                    size={170}
                    slices={[
                      { value: bulkResult.high, color: "#ef4444", label: "High" },
                      { value: bulkResult.medium, color: "#f59e0b", label: "Medium" },
                      { value: bulkResult.low, color: "#22c55e", label: "Low" },
                    ]}
                    centerLabel={String(bulkResult.total)}
                    centerSub="Total"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-3">Risk Distribution (Bar)</h4>
                  <BarRow label="High Risk" value={bulkResult.high} total={bulkResult.total} color="#ef4444" />
                  <BarRow label="Medium Risk" value={bulkResult.medium} total={bulkResult.total} color="#f59e0b" />
                  <BarRow label="Low Risk" value={bulkResult.low} total={bulkResult.total} color="#22c55e" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {bulkResult && (
        <>
          <div className="rounded-2xl bg-card shadow-card p-6">
            <h3 className="font-semibold text-lg mb-4">Prediction Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    {["#", "Industry", "Company Stage", "Funding Level", "Company Size", "Location", "Prev. Layoffs", "Risk Score", "Risk Level"].map((h) => (
                      <th key={h} className="text-left py-3 px-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generateBulkRows(5).map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-2">{i + 1}</td>
                      <td className="py-3 px-2">{r.industry}</td>
                      <td className="py-3 px-2">{r.stage}</td>
                      <td className="py-3 px-2">{r.funds < 1_000_000 ? "Low Funding" : r.funds < 5_000_000 ? "Medium Funding" : "High Funding"}</td>
                      <td className="py-3 px-2">{r.laidOffCount < 50 ? "11 - 50" : r.laidOffCount < 200 ? "51 - 200" : "201 - 500"}</td>
                      <td className="py-3 px-2">{r.country}</td>
                      <td className="py-3 px-2">{r.laidOffPct > 20 ? "Yes" : "No"}</td>
                      <td className="py-3 px-2 font-semibold">{r.riskScore}</td>
                      <td className="py-3 px-2"><RiskBadge level={r.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 justify-end">
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted">
                <Download className="w-4 h-4" /> Download Results CSV
              </button>
              <button onClick={() => navigate({ to: "/full-results" })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brand text-brand text-sm font-semibold hover:bg-brand-soft">
                <ExternalLink className="w-4 h-4" /> View Full Results
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard color="success" icon={Check} title="Bulk Analysis Completed!" desc="Your dataset has been analyzed successfully using our machine learning model." />
            <InfoCard color="info" icon={Info} title="What's Next?" desc="Explore skill gaps and get personalized skill recommendations for your team." cta={{ label: "Analyze Skill Gaps", onClick: () => navigate({ to: "/skill-gap" }) }} />
            <InfoCard color="warning" icon={Lightbulb} title="Why this matters?" desc="Identifying high-risk companies early helps you take proactive career decisions." />
          </div>
        </>
      )}

      <div>
        <h3 className="text-sm font-semibold text-brand mb-3">Next Steps (Guided Workflow)</h3>
        <WorkflowSteps
          title=""
          steps={[
            { label: "Risk Prediction", status: bulkResult ? "completed" : "current" },
            { label: "Skill Gap Analysis", status: "pending", sub: "Find your skill gaps" },
            { label: "Skill Recommendations", status: "pending", sub: "Get personalized suggestions" },
            { label: "Dashboard", status: "pending", sub: "View complete summary" },
          ]}
        />
      </div>
    </>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: "brand" | "danger" | "warning" | "success" }) {
  const map = {
    brand: "bg-brand-soft/40 text-brand",
    danger: "bg-danger-soft text-danger",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  };
  return (
    <div className={`rounded-xl p-4 ${map[color]}`}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-[10px] opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = (value / total) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const map = { High: "bg-danger-soft text-danger", Medium: "bg-warning-soft text-warning", Low: "bg-success-soft text-success" };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${map[level]}`}>{level}</span>;
}

function InfoCard({ color, icon: Icon, title, desc, cta }: { color: "success" | "info" | "warning"; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; cta?: { label: string; onClick: () => void } }) {
  const map = {
    success: "bg-success-soft/50 text-success",
    info: "bg-blue-50 text-blue-600",
    warning: "bg-warning-soft/60 text-warning",
  };
  return (
    <div className="rounded-xl bg-card shadow-card p-4 flex items-start gap-3 relative">
      <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${map[color]}`}><Icon className="w-5 h-5" /></div>
      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${color === "success" ? "text-success" : color === "info" ? "text-blue-600" : "text-warning"}`}>{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        {cta && (
          <button onClick={cta.onClick} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
            {cta.label} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function Select({ label, required, value, onChange, options, placeholder }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground">{label} {required && <span className="text-danger">*</span>}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Input({ label, required, value, onChange, placeholder, type = "text" }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground">{label} {required && <span className="text-danger">*</span>}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" />
    </label>
  );
}
