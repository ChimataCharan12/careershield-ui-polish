import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DonutChart } from "@/components/careershield/DonutChart";
import { generateBulkRows, INDUSTRIES } from "@/lib/careershield/mock-data";
import { ArrowLeft, Download, FileSpreadsheet, FileText, Search, Lightbulb, TrendingUp, AlertTriangle, Shield, Users, BarChart3, Rocket } from "lucide-react";

export const Route = createFileRoute("/full-results")({
  head: () => ({ meta: [{ title: "Full Results — CareerShield AI" }] }),
  component: FullResultsPage,
});

function FullResultsPage() {
  const navigate = useNavigate();
  const allRows = useMemo(() => generateBulkRows(100), []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [sort, setSort] = useState<"score-desc" | "score-asc">("score-desc");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = allRows.filter((x) =>
      x.company.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All" || x.riskLevel === filter)
    );
    r.sort((a, b) => sort === "score-desc" ? b.riskScore - a.riskScore : a.riskScore - b.riskScore);
    return r;
  }, [allRows, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const high = allRows.filter((r) => r.riskLevel === "High").length;
  const medium = allRows.filter((r) => r.riskLevel === "Medium").length;
  const low = allRows.filter((r) => r.riskLevel === "Low").length;
  const avg = Math.round(allRows.reduce((a, r) => a + r.riskScore, 0) / allRows.length);

  const industryStats = INDUSTRIES.map((i) => {
    const rows = allRows.filter((r) => r.industry === i);
    return { industry: i, count: rows.length, avg: rows.length ? Math.round(rows.reduce((a, r) => a + r.riskScore, 0) / rows.length) : 0 };
  }).filter((x) => x.count);
  const highest = industryStats.reduce((a, b) => (a.avg > b.avg ? a : b));
  const lowest = industryStats.reduce((a, b) => (a.avg < b.avg ? a : b));
  const totalAffected = allRows.reduce((a, r) => a + r.laidOffCount, 0);

  const download = (kind: "csv" | "xls" | "pdf") => {
    const header = ["Company", "Industry", "Country", "Stage", "Funds", "LaidOffPct", "LaidOffCount", "RiskScore", "RiskLevel"];
    const body = filtered.map((r) => [r.company, r.industry, r.country, r.stage, r.funds, r.laidOffPct, r.laidOffCount, r.riskScore, r.riskLevel]);
    const sep = kind === "xls" ? "\t" : ",";
    const content = [header.join(sep), ...body.map((r) => r.join(sep))].join("\n");
    const ext = kind === "xls" ? "xls" : kind === "pdf" ? "txt" : "csv";
    const mime = kind === "xls" ? "application/vnd.ms-excel" : "text/csv";
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bulk-analysis-results.${ext}`;
    a.click();
  };

  return (
    <AppShell title="Full Results" icon={BarChart3}>
      <div className="max-w-[1500px] mx-auto space-y-6">
        <Link to="/risk-prediction" className="inline-flex items-center gap-2 text-brand text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Bulk Analysis
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Full Results - Bulk Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete results for all analyzed companies. You can filter, sort and export the data.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Records" value={allRows.length} sub="Analyzed Successfully" color="brand" />
          <StatCard label="High Risk" value={high} sub={`${((high / allRows.length) * 100).toFixed(1)}% of total`} color="danger" />
          <StatCard label="Medium Risk" value={medium} sub={`${((medium / allRows.length) * 100).toFixed(1)}% of total`} color="warning" />
          <StatCard label="Low Risk" value={low} sub={`${((low / allRows.length) * 100).toFixed(1)}% of total`} color="success" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-card shadow-card p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold">Search Company</label>
            <div className="mt-1 relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by company name..." className="w-full pl-3 pr-9 py-2.5 rounded-lg border border-border text-sm" />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold">Filter Risk Level</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "All" | "High" | "Medium" | "Low")} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border text-sm">
              <option>All</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as "score-desc" | "score-asc")} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border text-sm">
              <option value="score-desc">Risk Score (High to Low)</option>
              <option value="score-asc">Risk Score (Low to High)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">Records per page</label>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border text-sm">
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
          <button onClick={() => { setQuery(""); setFilter("All"); setSort("score-desc"); setPerPage(25); }} className="py-2.5 rounded-lg border border-border text-sm font-semibold">↻ Clear Filters</button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Table */}
          <div className="rounded-2xl bg-card shadow-card p-5">
            <h3 className="font-bold mb-3">All Company Results ({filtered.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    {["#", "Company Name", "Industry", "Location HQ", "Country", "Stage", "Funds Raised (USD)", "% Laid Off", "Laid Off Count", "Risk Score", "Risk Level"].map((h) => (
                      <th key={h} className="text-left py-3 px-2 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2">{(page - 1) * perPage + i + 1}</td>
                      <td className="py-3 px-2 text-brand font-semibold whitespace-nowrap">{r.company}</td>
                      <td className="py-3 px-2">{r.industry}</td>
                      <td className="py-3 px-2">{r.location}</td>
                      <td className="py-3 px-2">{r.country}</td>
                      <td className="py-3 px-2">{r.stage}</td>
                      <td className="py-3 px-2">${r.funds.toLocaleString()}</td>
                      <td className="py-3 px-2">{r.laidOffPct}%</td>
                      <td className="py-3 px-2">{r.laidOffCount}</td>
                      <td className={`py-3 px-2 font-semibold ${r.riskLevel === "High" ? "text-danger" : r.riskLevel === "Medium" ? "text-warning" : "text-success"}`}>{r.riskScore}</td>
                      <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.riskLevel === "High" ? "bg-danger-soft text-danger" : r.riskLevel === "Medium" ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}>{r.riskLevel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3 text-sm">
              <div className="text-muted-foreground text-xs">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of <span className="font-semibold">{filtered.length}</span> records</div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded border border-border">‹</button>
                {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded ${page === p ? "bg-brand text-white" : "border border-border"}`}>{p}</button>
                ))}
                {totalPages > 4 && <><span className="px-1">…</span><button onClick={() => setPage(totalPages)} className={`w-8 h-8 rounded ${page === totalPages ? "bg-brand text-white" : "border border-border"}`}>{totalPages}</button></>}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-8 h-8 rounded border border-border">›</button>
              </div>
            </div>
          </div>

          {/* Insights panel */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4 text-brand" /> Key Insights</h3>
              <InsightRow icon={AlertTriangle} color="danger" label="Highest Risk Industry" value={highest.industry} />
              <InsightRow icon={TrendingUp} color="brand" label="Average Risk Score" value={`${avg} / 100`} />
              <InsightRow icon={Shield} color="warning" label="High Risk Companies" value={`${high} (${((high / allRows.length) * 100).toFixed(1)}%)`} />
              <InsightRow icon={Shield} color="success" label="Lowest Risk Industry" value={lowest.industry} />
              <InsightRow icon={Users} color="brand" label="Total Employees Potentially Affected" value={totalAffected.toLocaleString()} />
            </div>
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h3 className="font-bold text-sm mb-3">Risk Level Distribution</h3>
              <div className="flex items-center gap-3">
                <DonutChart size={140} slices={[
                  { value: high, color: "#ef4444", label: "" },
                  { value: medium, color: "#f59e0b", label: "" },
                  { value: low, color: "#22c55e", label: "" },
                ]} centerLabel={String(allRows.length)} centerSub="Total" />
                <div className="text-xs space-y-1">
                  <LegendRow color="#ef4444" label="High Risk" v={`${high} (${((high / allRows.length) * 100).toFixed(1)}%)`} />
                  <LegendRow color="#f59e0b" label="Medium Risk" v={`${medium} (${((medium / allRows.length) * 100).toFixed(1)}%)`} />
                  <LegendRow color="#22c55e" label="Low Risk" v={`${low} (${((low / allRows.length) * 100).toFixed(1)}%)`} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-2"><Rocket className="w-4 h-4 text-brand" /> Next Step</h3>
              <p className="text-xs text-muted-foreground mb-3">Take the next step to strengthen your workforce strategy.</p>
              <button onClick={() => navigate({ to: "/skill-gap" })} className="w-full py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-semibold inline-flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Analyze Skill Gaps →</button>
              <button onClick={() => navigate({ to: "/dashboard" })} className="mt-2 w-full py-2.5 rounded-lg border border-brand text-brand text-sm font-semibold inline-flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4" /> Go to Dashboard</button>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="rounded-2xl bg-card shadow-card p-5">
          <h3 className="font-bold mb-3">Export Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => download("csv")} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand">
              <div className="w-10 h-10 rounded-lg bg-success-soft text-success flex items-center justify-center"><FileText className="w-5 h-5" /></div>
              <span className="font-semibold">Download CSV</span>
            </button>
            <button onClick={() => download("xls")} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand">
              <div className="w-10 h-10 rounded-lg bg-success-soft text-success flex items-center justify-center"><FileSpreadsheet className="w-5 h-5" /></div>
              <span className="font-semibold">Download Excel</span>
            </button>
            <button onClick={() => download("pdf")} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand">
              <div className="w-10 h-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Download className="w-5 h-5" /></div>
              <span className="font-semibold">Download PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: "brand" | "danger" | "warning" | "success" }) {
  const map = {
    brand: "border-brand/20 [&_.lbl]:text-brand",
    danger: "border-danger/20 [&_.lbl]:text-danger",
    warning: "border-warning/30 [&_.lbl]:text-warning",
    success: "border-success/20 [&_.lbl]:text-success",
  };
  return (
    <div className={`rounded-xl bg-card border ${map[color]} shadow-card p-5`}>
      <div className="lbl text-xs font-semibold">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function InsightRow({ icon: Icon, color, label, value }: { icon: React.ComponentType<{ className?: string }>; color: "danger" | "warning" | "success" | "brand"; label: string; value: string }) {
  const map = { danger: "bg-danger-soft text-danger", warning: "bg-warning-soft text-warning", success: "bg-success-soft text-success", brand: "bg-brand-soft text-brand" };
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0 border-border/50">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${map[color]}`}><Icon className="w-4 h-4" /></div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-bold truncate">{value}</div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, v }: { color: string; label: string; v: string }) {
  return (
    <div className="flex items-center gap-2 justify-between min-w-[150px]">
      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} /> {label}</div>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
