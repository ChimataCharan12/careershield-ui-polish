import { Link, useLocation } from "@tanstack/react-router";
import { Home, Shield, Search, Star, BarChart3, Plus, Info } from "lucide-react";
import { useSession } from "@/lib/careershield/session";
import robotAsset from "@/assets/ai_robot.png.asset.json";
import { toast } from "sonner";

const items = [
  { to: "/", label: "Home", icon: Home, match: "/" },
  { to: "/risk-prediction", label: "Risk Prediction", icon: Shield, match: "/risk-prediction" },
  { to: "/skill-gap", label: "Skill Gap Analysis", icon: Search, match: "/skill-gap" },
  { to: "/recommendations", label: "Skill Recommendations", icon: Star, match: "/recommendations" },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3, match: "/dashboard" },
] as const;

export function Sidebar() {
  const location = useLocation();
  const { currentSessionId, sessionStarted, sessionStatus, newAnalysis } = useSession();

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-sidebar-gradient text-sidebar-fg sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">CareerShield AI</h1>
          <p className="text-[10px] text-sidebar-muted leading-tight">Smart Career. Secure Future.</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-2 space-y-1">
        {items.map((it) => {
          const active = it.match === "/" ? location.pathname === "/" : location.pathname.startsWith(it.match);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-brand-gradient text-white shadow-md" : "text-sidebar-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      {/* Current Session */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-[color:var(--color-sidebar-card)]/60 border border-white/5">
        <div className="flex items-center gap-1 text-xs text-sidebar-muted">
          Current Session <Info className="w-3 h-3" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-wide">{currentSessionId}</div>
        <div className="mt-1 text-xs text-sidebar-muted">Started: {sessionStarted}</div>
        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-success/20 text-success">
          {sessionStatus}
        </div>
      </div>

      {/* Robot card */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-[color:var(--color-sidebar-card)]/60 border border-white/5">
        <div className="flex justify-center -mb-2">
          <img src={robotAsset.url} alt="AI Robot" className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(91,33,255,0.5)]" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-sm">AI-Powered Insights</h3>
          <p className="text-[11px] text-sidebar-muted mt-1 leading-snug">
            Get accurate career risk predictions and build a future-ready career.
          </p>
        </div>
      </div>

      {/* New Analysis */}
      <div className="mx-4 mt-4 mb-6">
        <button
          onClick={() => {
            newAnalysis();
            toast.success("New analysis session started");
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-gradient text-white text-sm font-semibold shadow-lg hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </button>
      </div>
    </aside>
  );
}
