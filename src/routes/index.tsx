import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Rocket, Search, ShieldCheck, Brain, Clock, UserCheck, GraduationCap } from "lucide-react";
import heroAsset from "@/assets/home_hero.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerShield AI — Smart Career. Secure Future." },
      { name: "description", content: "AI-based layoff risk prediction and skill recommendation system." },
    ],
  }),
  component: HomePage,
});

const navItems = [
  { to: "/", label: "Home" },
  { to: "/risk-prediction", label: "Risk Prediction" },
  { to: "/skill-gap", label: "Skill Gap Analysis" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero with top nav */}
      <section className="bg-hero-gradient text-white">
        <header className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base">CareerShield AI</div>
              <div className="text-[10px] text-slate-300">Smart Career. Secure Future.</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-[color:var(--color-neon-blue)] border-b-2 border-[color:var(--color-neon-blue)] pb-1" }}
                className="text-slate-200 hover:text-white transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 lg:px-10 pt-8 pb-24">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]">
              AI-Based <span className="text-gradient-blue">Layoff Risk Prediction & Skill Recommendation</span> System
            </h1>
            <p className="mt-6 text-slate-300 max-w-lg leading-relaxed">
              Predict layoff risk, identify skill gaps, and receive personalized career growth recommendations using AI and Machine Learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/risk-prediction"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-lg hover:opacity-90 transition"
              >
                Analyze Risk <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition"
              >
                Explore Features <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            {/* Radial glow halo behind the shield to make image feel integrated */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(0,163,255,0.45) 0%, rgba(91,33,255,0.25) 30%, rgba(2,11,45,0) 65%)",
                filter: "blur(20px)",
              }}
            />
            <img
              src={heroAsset.url}
              alt="AI Shield"
              className="relative w-full max-w-xl mix-blend-screen drop-shadow-[0_0_60px_rgba(0,163,255,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 -mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {[
          { to: "/risk-prediction", title: "Risk Prediction", desc: "Predict employee layoff risk using machine learning.", icon: BarChart3, color: "text-blue-500 bg-blue-50" },
          { to: "/skill-gap", title: "Skill Gap Analysis", desc: "Identify missing skills compared to market demand.", icon: Search, color: "text-success bg-success-soft" },
          { to: "/recommendations", title: "Skill Recommendations", desc: "Receive personalized upskilling suggestions to boost your career.", icon: Rocket, color: "text-recommend bg-recommend-soft" },
          { to: "/dashboard", title: "Analytics Dashboard", desc: "Visualize predictions and career insights with powerful charts.", icon: BarChart3, color: "text-warning bg-warning-soft" },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl bg-card shadow-card p-6 hover:-translate-y-1 transition">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.color}`}>
              <c.icon className="w-7 h-7" />
            </div>
            <h3 className="mt-5 font-bold text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            <ArrowRight className="mt-4 w-4 h-4 text-brand group-hover:translate-x-1 transition" />
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
        <div className="rounded-2xl bg-slate-50 p-10">
          <h2 className="text-center text-2xl font-bold">
            How It Works
            <span className="block w-12 h-1 bg-brand-gradient mx-auto rounded-full mt-2" />
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", title: "Enter Details", desc: "Provide employee or company details to get started.", color: "bg-blue-50 text-blue-500", num: "bg-blue-500" },
              { n: "02", title: "Predict Risk", desc: "Our ML model analyzes the data and predicts layoff risk.", color: "bg-success-soft text-success", num: "bg-success" },
              { n: "03", title: "Analyze Skill Gap", desc: "We compare your skills with market demand to find gaps.", color: "bg-recommend-soft text-recommend", num: "bg-recommend" },
              { n: "04", title: "Get Recommendations", desc: "Receive personalized skill and career recommendations.", color: "bg-warning-soft text-warning", num: "bg-warning" },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className={`relative mx-auto w-24 h-24 rounded-full flex items-center justify-center ${s.color}`}>
                  {i === 0 && <Search className="w-10 h-10" />}
                  {i === 1 && <Brain className="w-10 h-10" />}
                  {i === 2 && <BarChart3 className="w-10 h-10" />}
                  {i === 3 && <Rocket className="w-10 h-10" />}
                  <span className={`absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${s.num}`}>{s.n}</span>
                </div>
                <h4 className="mt-4 font-semibold">{s.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 px-4">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature badges */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-8">
        <div className="rounded-2xl bg-slate-50 p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: "ML Powered", desc: "Advanced machine learning models for accurate predictions.", color: "bg-blue-500" },
            { icon: Clock, title: "Real-time Analysis", desc: "Get instant layoff risk assessment and skill gap insights.", color: "bg-success" },
            { icon: UserCheck, title: "Career Insights", desc: "Actionable insights to help you make better career decisions.", color: "bg-recommend" },
            { icon: GraduationCap, title: "Skill Recommendations", desc: "Personalized upskilling roadmap tailored just for you.", color: "bg-warning" },
          ].map((f, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hero-gradient text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">CareerShield AI</div>
                <div className="text-[10px] text-slate-300">Smart Career. Secure Future.</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              AI-Based Layoff Risk Prediction & Skill Recommendation System helps professionals stay ahead by predicting layoff risk and building future-ready skills.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {navItems.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>contact@careershield.ai</li>
              <li>+91 98765 43210</li>
              <li>Bangalore, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
          © 2024 CareerShield AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
