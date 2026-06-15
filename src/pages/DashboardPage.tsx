import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";
import { submitLead } from "@/lib/crmApi";
import {
  LogOut,
  Send,
  Loader2,
  CheckCircle,
  Activity,
  Zap,
  Cpu,
  RefreshCw,
  Brain,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

// ─── Types & Interfaces ────────────────────────────────────────────────────

interface DashForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const DASH_EMPTY: DashForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

// ─── AI Engine Log Messages Pool ───────────────────────────────────────────

const LOG_MESSAGES = [
  "neural models active: scanning cross-venue liquidity...",
  "BTC order book depth analysis complete: Buy confidence 94.2%.",
  "ETH gas-optimized entry routing active: Target spread 0.08%.",
  "SOL volume acceleration identified: increasing weight allocation to 18%.",
  "Capital preservation check: risk threshold limits holding green.",
  "Rebalancing transaction completed successfully.",
  "Yield pool deviation detected: re-routing stable assets to compound vault.",
  "Scanning institutional derivatives for volatility hedge parameters...",
  "L1 chain transaction velocity analysis complete.",
  "Drift rebalancer active: asset target parameters matching baseline model.",
];

// ─── AI Engine Premium Visualizer ───────────────────────────────────────────

function AIEngineAnimation() {
  const [logs, setLogs] = useState<string[]>([
    "System boot successful.",
    "neural models active: scanning cross-venue liquidity...",
    "BTC order book depth analysis complete: Buy confidence 94.2%.",
  ]);

  const [btcWeight, setBtcWeight] = useState(45);
  const [ethWeight, setEthWeight] = useState(35);
  const [solWeight, setSolWeight] = useState(20);

  // Rotate logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs((prev) => [`[${timestamp}] ${randomMsg}`, ...prev.slice(0, 3)]);
    }, 4000);

    return () => clearInterval(logInterval);
  }, []);

  // Fluctuates weights slightly to look active
  useEffect(() => {
    const weightInterval = setInterval(() => {
      setBtcWeight((prev) => Math.max(40, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1))));
      setEthWeight((prev) => Math.max(30, Math.min(40, prev + (Math.random() > 0.5 ? 1 : -1))));
      setSolWeight((prev) => Math.max(15, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);

    return () => clearInterval(weightInterval);
  }, []);

  return (
    <div className="w-full bg-slate-50/70 rounded-2xl border border-slate-100/80 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Visual Scanning Node Network */}
      <div className="h-44 w-full bg-white rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 300 160" className="w-full h-full text-slate-300">
          {/* Animated Connecting Lines */}
          <g stroke="#e2e8f0" strokeWidth="1.5">
            <motion.line x1="150" y1="80" x2="60" y2="40"
              animate={{ stroke: ["#e2e8f0", "#f59e0b", "#e2e8f0"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.line x1="150" y1="80" x2="240" y2="45"
              animate={{ stroke: ["#e2e8f0", "#3b82f6", "#e2e8f0"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            />
            <motion.line x1="150" y1="80" x2="150" y2="135"
              animate={{ stroke: ["#e2e8f0", "#10b981", "#e2e8f0"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </g>

          {/* Central AI Engine Node */}
          <motion.circle cx="150" cy="80" r="18" fill="#fafafa" stroke="#1e293b" strokeWidth="2"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="150" y="83" textAnchor="middle" className="text-[9px] font-bold fill-slate-800 tracking-wider font-mono">
            ATLAS
          </text>

          {/* Orbiting Asset Nodes */}
          {/* BTC */}
          <circle cx="60" cy="40" r="14" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
          <text x="60" y="43" textAnchor="middle" className="text-[8px] font-bold fill-amber-600 font-mono">BTC</text>
          
          {/* ETH */}
          <circle cx="240" cy="45" r="14" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
          <text x="240" y="48" textAnchor="middle" className="text-[8px] font-bold fill-blue-600 font-mono">ETH</text>

          {/* SOL */}
          <circle cx="150" cy="135" r="14" fill="#fff" stroke="#10b981" strokeWidth="2" />
          <text x="150" y="138" textAnchor="middle" className="text-[8px] font-bold fill-emerald-600 font-mono">SOL</text>
        </svg>

        {/* Pulse Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-500/[0.01] to-transparent pointer-events-none" />
      </div>

      {/* Asset Weights & Confidence Scores */}
      <div className="space-y-4 bg-white rounded-xl border border-slate-100 p-4 sm:p-5">
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
          Target Asset Selection & Weights
        </div>
        <div className="space-y-3">
          {/* BTC */}
          <div className="space-y-1">
            <div className="flex justify-between text-[13px] sm:text-[14px]">
              <span className="font-semibold text-slate-800">Bitcoin (BTC)</span>
              <span className="font-mono text-amber-600 font-bold">{btcWeight}% Allocation</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${btcWeight}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          {/* ETH */}
          <div className="space-y-1">
            <div className="flex justify-between text-[13px] sm:text-[14px]">
              <span className="font-semibold text-slate-800">Ethereum (ETH)</span>
              <span className="font-mono text-blue-600 font-bold">{ethWeight}% Allocation</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${ethWeight}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          {/* SOL */}
          <div className="space-y-1">
            <div className="flex justify-between text-[13px] sm:text-[14px]">
              <span className="font-semibold text-slate-800">Solana (SOL)</span>
              <span className="font-mono text-emerald-600 font-bold">{solWeight}% Allocation</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${solWeight}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Decision Log */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 font-mono text-[12px] sm:text-[13px] text-slate-300 space-y-2 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live AI Decisions
          </span>
          <span className="text-[11px] text-slate-500 uppercase">Interactive Feed</span>
        </div>
        <div className="space-y-1.5 h-28 overflow-hidden flex flex-col justify-start">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="truncate leading-relaxed"
              >
                <span className="text-slate-500">&gt;</span> {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Support Contact Form ───────────────────────────────────────────────────

function DashboardContactForm() {
  const [form, setForm] = useState<DashForm>(DASH_EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof DashForm, string>>>({});
  const [apiError, setApiError] = useState("");

  const setF = (field: keyof DashForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof DashForm, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setApiError("");
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setApiError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass = (field: keyof DashForm) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-400" : "border-border"} bg-background/60 px-4 py-4 text-[16px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all duration-200 backdrop-blur-sm`;

  return (
    <section className="relative overflow-hidden py-24 border-t border-border/60">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-[13px] sm:text-[14px] text-muted-foreground font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              Support Desk
            </div>
            <h2 className="text-[32px] sm:text-[44px] font-medium tracking-[-0.03em] leading-[1.08] text-foreground">
              Speak with our strategy team
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Our trading desks can assist in constructing private allocations, API integrations, and customized rebalancing rules.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_60px_-20px_rgba(17,17,17,0.05)]">
            <AnimatePresence mode="wait">
              {/* Success */}
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-16 w-14 text-foreground" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-[24px] font-medium tracking-tight text-foreground">Request received</h3>
                  <p className="text-[15px] text-muted-foreground max-w-xs leading-relaxed">
                    An advisor will contact you within 2 hours during active market sessions.
                  </p>
                  <button
                    onClick={() => { setForm(DASH_EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                    className="mt-4 inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-[15px] font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Name */}
                  <div>
                    <label className="block text-[14px] font-semibold text-foreground uppercase tracking-wide mb-2">Name *</label>
                    <input type="text" placeholder="John Doe" value={form.name} onChange={setF("name")} className={inputClass("name")} />
                    {errors.name && <p className="mt-1.5 text-[12px] text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-semibold text-foreground uppercase tracking-wide mb-2">Email address *</label>
                      <input type="email" placeholder="you@domain.com" value={form.email} onChange={setF("email")} className={inputClass("email")} />
                      {errors.email && <p className="mt-1.5 text-[12px] text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[14px] font-semibold text-foreground uppercase tracking-wide mb-2">Phone number *</label>
                      <input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={setF("phone")} className={inputClass("phone")} />
                      {errors.phone && <p className="mt-1.5 text-[12px] text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[14px] font-semibold text-foreground uppercase tracking-wide mb-2">Message (optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Specify your target allocation, underlying portfolio values, or technical questions..."
                      value={form.message}
                      onChange={setF("message")}
                      className={`${inputClass("message")} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
                      {apiError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <p className="text-[13px] text-muted-foreground">All metrics and discussions remain strictly confidential.</p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-8 text-[15px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                    >
                      {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {status === "loading" ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter_Tight',sans-serif] antialiased selection:bg-foreground selection:text-background relative">
      
      {/* Ambient background grid & gradients */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/[0.02] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/[0.02] blur-[140px]" />
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
          {/* Logo */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-2 text-[16px] font-medium tracking-tight cursor-pointer"
          >
            <Logo className="h-5 w-5 text-foreground" />
            <span>AtlasLedger</span>
          </a>

          {/* Navigation Links */}
          <nav className="flex items-center gap-7 text-[15px] text-muted-foreground">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium focus:outline-none cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </button>
          </nav>
        </div>
      </motion.header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-20 space-y-20">
        
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-[13px] sm:text-[14px] text-muted-foreground font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Authorized Vault Workspace
            </div>
            <h1 className="mt-6 text-[42px] sm:text-[56px] lg:text-[68px] font-medium tracking-[-0.035em] leading-[1.08] text-foreground">
              Hello, {user?.firstName || "Investor"}.
            </h1>
            <p className="mt-6 text-[19px] sm:text-[21px] lg:text-[23px] text-muted-foreground leading-relaxed max-w-4xl">
              Welcome to the AtlasLedger institutional platform. We help you invest in the right cryptocurrency opportunities by leveraging our state-of-the-art **Atlas AI-Quantum Engine**. Our automated systems evaluate volume triggers, price spreads, and structural trend indicators in real time to optimize entry, custody allocations, and asset weights.
            </p>
          </div>
        </motion.section>

        {/* ── Bots Showcase List (Descriptive Focus) ─────────────────── */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-6 mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-medium tracking-tight text-slate-900">
              AI-Powered Crypto Investment Strategy
            </h2>
            <p className="text-[16px] sm:text-[18px] text-muted-foreground mt-2 leading-relaxed">
              Understand how our proprietary automation platform secures and optimizes your digital asset exposure.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center py-6">
            {/* Text Specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/30">
                <Brain className="h-4 w-4" />
                Active Quantitative Engine
              </div>
              <h3 className="text-[32px] sm:text-[38px] font-semibold text-foreground tracking-tight leading-tight">
                The Atlas AI-Quantum Engine
              </h3>
              <p className="text-[17px] sm:text-[19px] text-muted-foreground leading-relaxed">
                Rather than relying on speculative advice or manual execution, AtlasLedger deploys a unified neural network model to navigate liquid cryptocurrency markets. The AI bot continuously tracks price volatility, trade imbalances, and developer activity metrics to allocate funds toward the absolute highest quality assets (BTC, ETH, and select blue-chip protocols).
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-slate-800">Target Selection</h4>
                    <p className="text-[14px] sm:text-[15px] text-muted-foreground mt-0.5">Scans institutional spreads, network health, and velocity to allocate only to verified tokens with strong fundamental tailwinds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-slate-800">Risk Allocation</h4>
                    <p className="text-[14px] sm:text-[15px] text-muted-foreground mt-0.5">Executes delta-neutral hedging and stop-drift rebalancing to defend capital from sudden drawdowns and market slippage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-slate-800">Yield Compounding</h4>
                    <p className="text-[14px] sm:text-[15px] text-muted-foreground mt-0.5">Routes stable pool allocations to capital-efficient liquid staking hubs to capture high yields automatically.</p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/40">
                <div>
                  <div className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Primary Target</div>
                  <div className="text-[17px] sm:text-[19px] font-bold text-slate-800 mt-1">BTC & ETH Outperformance</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Risk Rating</div>
                  <div className="text-[17px] sm:text-[19px] font-bold text-slate-800 mt-1">Low / Hedged</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">AI Scan Speed</div>
                  <div className="text-[17px] sm:text-[19px] font-bold text-slate-800 mt-1">&lt;12ms latency</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Execution Spec</div>
                  <div className="text-[17px] sm:text-[19px] font-bold text-slate-800 mt-1">Auto-rebalance</div>
                </div>
              </div>
            </div>

            {/* Simulation Animation Widget */}
            <div className="lg:col-span-5 self-start">
              <AIEngineAnimation />
            </div>
          </div>
        </section>

        {/* ── Contact Form ───────────────────────────────────────────── */}
        <DashboardContactForm />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 mt-12 relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[14px] text-muted-foreground">
          <div>© {new Date().getFullYear()} AtlasLedger · All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
