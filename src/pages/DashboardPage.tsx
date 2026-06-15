import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { submitLead } from "@/lib/crmApi";
import {
  LogOut,
  Send,
  Loader2,
  CheckCircle,
  Play,
  Pause,
  Home,
  Bot,
  Activity,
  Zap,
  Cpu,
  RefreshCw,
} from "lucide-react";

// ─── Types & Interfaces ────────────────────────────────────────────────────

interface BotData {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "paused";
  stats: {
    profit24h: string;
    winRate: string;
    totalTrades: number;
    extra: string;
  };
}

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

// ─── Demo Bots Initial Data ────────────────────────────────────────────────

const INITIAL_BOTS: BotData[] = [
  {
    id: "arbitrage",
    name: "Alpha Arbitrage Bot",
    description: "Monitors sub-second price discrepancies across multiple decentralized liquidity pools to capture instant delta-neutral returns.",
    type: "Arbitrage Execution",
    status: "active",
    stats: { profit24h: "+$42.50", winRate: "99.2%", totalTrades: 1208, extra: "Latency: 8ms" },
  },
  {
    id: "momentum",
    name: "Trend Momentum Bot",
    description: "Capitalizes on structural trend movements using advanced exponential moving average crossovers and volume breakouts.",
    type: "Trend Following",
    status: "active",
    stats: { profit24h: "+$134.12", winRate: "74.5%", totalTrades: 184, extra: "SMA: 200/50" },
  },
  {
    id: "market_maker",
    name: "Delta Market Maker Bot",
    description: "Provides bid-ask spread depth on high-volume trading pairs, continuously adjusting inventory ratios based on order flow.",
    type: "Spread Provision",
    status: "paused",
    stats: { profit24h: "$0.00", winRate: "92.1%", totalTrades: 4210, extra: "Spread: 0.05%" },
  },
  {
    id: "yield",
    name: "Yield Harvester Bot",
    description: "Automatically redirects smart contract deposit capital to capture peak compounding yield opportunities across vetted protocols.",
    type: "Yield Optimization",
    status: "active",
    stats: { profit24h: "+$89.40", winRate: "100.0%", totalTrades: 48, extra: "APY: 14.2%" },
  },
];

// ─── Bot Animation Sub-components ──────────────────────────────────────────

function ArbitrageAnimation({ active }: { active: boolean }) {
  return (
    <div className="h-28 w-full bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
      <div className="flex items-center gap-6 z-10">
        {["USD", "BTC", "ETH"].map((coin, i) => (
          <div key={coin} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-sm">
              {coin}
            </div>
            {i < 2 && (
              <div className="w-6 h-px bg-slate-200 relative">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-amber-500 absolute top-[-2px] left-0"
                  animate={active ? { left: ["0%", "100%"] } : { left: "0%" }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.02] via-transparent to-amber-500/[0.02]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function MomentumAnimation({ active }: { active: boolean }) {
  return (
    <div className="h-28 w-full bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden px-4">
      <svg viewBox="0 0 200 60" className="w-full h-full text-slate-300">
        <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(0,0,0,0.03)" strokeDasharray="3 3" />
        <motion.path
          d="M0,45 Q40,10 80,45 T160,15 T200,30"
          fill="none"
          stroke={active ? "#f59e0b" : "#94a3b8"}
          strokeWidth="2"
          initial={{ pathLength: 0.8 }}
          animate={active ? { pathOffset: [0, 1] } : {}}
          style={{ strokeDasharray: "15, 5" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,35 Q40,35 80,25 T160,25 T200,20"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}

function MarketMakerAnimation({ active }: { active: boolean }) {
  const [ticks, setTicks] = useState([
    { p: 67840, size: 45, type: "bid" },
    { p: 67839, size: 70, type: "bid" },
    { p: 67843, size: 30, type: "ask" },
    { p: 67844, size: 55, type: "ask" },
  ]);

  useEffect(() => {
    if (!active) return;
    const int = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => ({
          ...t,
          size: Math.max(10, Math.min(95, t.size + (Math.random() - 0.5) * 20)),
        }))
      );
    }, 900);
    return () => clearInterval(int);
  }, [active]);

  return (
    <div className="h-28 w-full bg-slate-50/60 rounded-xl border border-slate-100 p-3 flex flex-col justify-between overflow-hidden">
      {ticks.map((t, i) => (
        <div key={i} className="flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span className={t.type === "bid" ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
            {t.p}
          </span>
          <div className="flex-1 mx-3 h-1.5 bg-slate-200/50 rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 bottom-0 rounded-full transition-all duration-700 ${t.type === "bid" ? "bg-emerald-400" : "bg-rose-400"}`}
              style={{
                width: active ? `${t.size}%` : "15%",
                left: t.type === "bid" ? 0 : "auto",
                right: t.type === "ask" ? 0 : "auto",
              }}
            />
          </div>
          <span className="tabular-nums">{(t.size / 100).toFixed(2)} BTC</span>
        </div>
      ))}
    </div>
  );
}

function YieldAnimation({ active }: { active: boolean }) {
  return (
    <div className="h-28 w-full bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="100"
            animate={active ? { strokeDashoffset: [100, 0] } : { strokeDashoffset: 65 }}
            transition={active ? { duration: 5, repeat: Infinity, ease: "linear" } : {}}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCw className={`h-4 w-4 text-amber-500/80 ${active ? "animate-spin" : ""}`} style={{ animationDuration: active ? "3s" : "0s" }} />
        </div>
      </div>
      {active && (
        <motion.div
          className="absolute right-4 bottom-2 text-[10px] text-emerald-600 font-medium flex items-center gap-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Compounding...
        </motion.div>
      )}
    </div>
  );
}

// ─── Contact Form Component ─────────────────────────────────────────────────

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
    `w-full rounded-xl border ${errors[field] ? "border-red-400" : "border-border"} bg-background/60 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all duration-200 backdrop-blur-sm`;

  return (
    <section className="relative overflow-hidden py-20 border-t border-border/60">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              Support
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-medium tracking-[-0.03em] leading-[1.08] text-foreground">
              Need help with your strategies?
            </h2>
            <p className="mt-3 text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              Our investment advisors are available to assist with your automated trading setups.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(17,17,17,0.05)]">
            <AnimatePresence mode="wait">
              {/* Success */}
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-4 py-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-12 w-12 text-foreground" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-[20px] font-medium tracking-tight text-foreground">Message sent!</h3>
                  <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
                    Thank you. A trading strategist will contact you within 2 hours.
                  </p>
                  <button
                    onClick={() => { setForm(DASH_EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                    className="mt-2 inline-flex h-9 items-center rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Name */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground mb-2">Name *</label>
                    <input type="text" placeholder="John Doe" value={form.name} onChange={setF("name")} className={inputClass("name")} />
                    {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground mb-2">Email address *</label>
                      <input type="email" placeholder="you@domain.com" value={form.email} onChange={setF("email")} className={inputClass("email")} />
                      {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground mb-2">Phone number *</label>
                      <input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={setF("phone")} className={inputClass("phone")} />
                      {errors.phone && <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground mb-2">Message (optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Ask about trading strategies, bot optimization, or portfolio tools..."
                      value={form.message}
                      onChange={setF("message")}
                      className={`${inputClass("message")} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                      {apiError}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-[11px] text-muted-foreground">Secure & encrypted transmission.</p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {status === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
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
  const [bots, setBots] = useState<BotData[]>(INITIAL_BOTS);

  const toggleBot = (id: string) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "active" ? "paused" : "active" }
          : b
      )
    );
  };

  const activeBotsCount = bots.filter((b) => b.status === "active").length;

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
            className="flex shrink-0 items-center gap-2 text-[15px] font-medium tracking-tight cursor-pointer"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-border bg-foreground text-background text-[11px] font-semibold">
              A
            </span>
            <span>AtlasLedger</span>
          </a>

          {/* Navigation Links */}
          <nav className="flex items-center gap-7 text-[14px] text-muted-foreground">
            <a
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium"
            >
              <Home className="h-4 w-4" />
              Home
            </a>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium focus:outline-none cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </motion.header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 space-y-12">
        
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Status Online
            </div>
            <h1 className="mt-5 text-[32px] sm:text-[44px] font-medium tracking-[-0.03em] leading-[1.08] text-foreground">
              Hello, {user?.firstName || "Investor"}.
            </h1>
            <p className="mt-3 text-[15px] sm:text-[17px] text-muted-foreground leading-relaxed">
              Welcome to your automated trading workspace. Currently, you have{" "}
              <span className="font-semibold text-foreground">{activeBotsCount} of {bots.length} trading bots</span> running simulations on active crypto market parameters.
            </p>
          </div>
        </motion.section>

        {/* ── Demo Bots Section ──────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <h2 className="text-[20px] font-medium tracking-tight">Active Algorithmic Bots</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Control and inspect real-time demo bot strategies.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[12px] bg-slate-100 rounded-full px-3 py-1 font-medium text-slate-600">
                <Activity className="h-3.5 w-3.5" />
                Live Simulations
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bots.map((bot, idx) => {
              const isActive = bot.status === "active";
              return (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/40">
                          {bot.type}
                        </span>
                        <h3 className="text-[18px] font-semibold text-foreground pt-1.5">{bot.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          {bot.status}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-muted-foreground leading-relaxed h-12 overflow-hidden text-ellipsis">
                      {bot.description}
                    </p>

                    {/* Visual Animation Container */}
                    <div className="pt-2">
                      {bot.id === "arbitrage" && <ArbitrageAnimation active={isActive} />}
                      {bot.id === "momentum" && <MomentumAnimation active={isActive} />}
                      {bot.id === "market_maker" && <MarketMakerAnimation active={isActive} />}
                      {bot.id === "yield" && <YieldAnimation active={isActive} />}
                    </div>

                    {/* Stats Rows */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border/40 text-[12px] bg-slate-50/40 rounded-xl px-3">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">24H Profit</div>
                        <div className={`font-semibold mt-0.5 tabular-nums ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
                          {bot.stats.profit24h}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Win Rate</div>
                        <div className="font-semibold text-slate-800 mt-0.5 tabular-nums">
                          {bot.stats.winRate}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total Trades</div>
                        <div className="font-semibold text-slate-800 mt-0.5 tabular-nums">
                          {bot.stats.totalTrades}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & controls */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/40">
                    <span className="text-[11px] text-muted-foreground font-mono">{bot.stats.extra}</span>
                    <button
                      onClick={() => toggleBot(bot.id)}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12px] font-medium border transition-colors cursor-pointer focus:outline-none ${
                        isActive
                          ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          Pause Bot
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Start Bot
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Crypto Investment Highlights ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-amber-500/[0.01] blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Investment Infrastructure</div>
            <h2 className="text-[22px] font-medium text-foreground">Next-generation quantitative vaults</h2>
            <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
              AtlasLedger connects multi-venue liquidity channels directly to localized processing instances, allowing you to configure, audit, and simulate complex algorithmic models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Cpu className="h-5 w-5 text-amber-500" />, title: "Quant Engine", desc: "Process real-time order matching with zero slippage during demo environments." },
              { icon: <Zap className="h-5 w-5 text-amber-500" />, title: "Arbitrage Execution", desc: "Scan cross-venue price spreads to leverage instant decentralized exchange margins." },
              { icon: <Bot className="h-5 w-5 text-amber-500" />, title: "Automated Triggers", desc: "Deploy rules to rebalance currency weighting dynamically when threshold drifts exceed 1.5%." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl border border-border/40 bg-slate-50/20">
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-[14px] font-semibold text-foreground">{item.title}</h3>
                <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Contact Form ───────────────────────────────────────────── */}
        <DashboardContactForm />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6 mt-8 relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground">
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
