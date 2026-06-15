import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { submitLead } from "@/lib/crmApi";
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Loader2,
  CheckCircle,
  Bitcoin,
  Wallet,
  BarChart3,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const PORTFOLIO_HISTORY = [
  { date: "May 17", value: 84200 },
  { date: "May 19", value: 87800 },
  { date: "May 21", value: 83100 },
  { date: "May 23", value: 91400 },
  { date: "May 25", value: 94700 },
  { date: "May 27", value: 92200 },
  { date: "May 29", value: 98500 },
  { date: "May 31", value: 96100 },
  { date: "Jun 02", value: 102300 },
  { date: "Jun 04", value: 99800 },
  { date: "Jun 06", value: 107400 },
  { date: "Jun 08", value: 112100 },
  { date: "Jun 10", value: 108700 },
  { date: "Jun 12", value: 118900 },
  { date: "Jun 14", value: 124300 },
];

const CRYPTOS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67842.5,
    change: 2.34,
    held: 1.842,
    value: 124945.0,
    color: "#f7931a",
    sparkline: [62100, 63400, 61800, 65200, 66900, 65500, 67842],
    icon: "₿",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3541.2,
    change: -0.87,
    held: 14.6,
    value: 51701.52,
    color: "#627eea",
    sparkline: [3200, 3380, 3290, 3450, 3510, 3480, 3541],
    icon: "Ξ",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 178.9,
    change: 5.12,
    held: 210.0,
    value: 37569.0,
    color: "#9945ff",
    sparkline: [145, 152, 161, 158, 168, 172, 178.9],
    icon: "◎",
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 612.4,
    change: 1.22,
    held: 28.5,
    value: 17453.4,
    color: "#f0b90b",
    sparkline: [580, 591, 585, 602, 608, 610, 612.4],
    icon: "◈",
  },
];

const ALLOCATION_DATA = [
  { name: "Bitcoin", value: 53.4, color: "#f7931a" },
  { name: "Ethereum", value: 22.1, color: "#627eea" },
  { name: "Solana", value: 16.1, color: "#9945ff" },
  { name: "BNB", value: 7.4, color: "#f0b90b" },
  { name: "Other", value: 1.0, color: "#6b7280" },
];

const TRANSACTIONS = [
  { id: 1, coin: "BTC", type: "buy" as const, amount: 0.25, value: 16960.63, date: "Jun 14, 2026", status: "completed" },
  { id: 2, coin: "ETH", type: "sell" as const, amount: 3.0, value: 10623.6, date: "Jun 13, 2026", status: "completed" },
  { id: 3, coin: "SOL", type: "buy" as const, amount: 50.0, value: 8945.0, date: "Jun 12, 2026", status: "completed" },
  { id: 4, coin: "BNB", type: "buy" as const, amount: 8.5, value: 5205.4, date: "Jun 11, 2026", status: "pending" },
  { id: 5, coin: "BTC", type: "sell" as const, amount: 0.1, value: 6784.25, date: "Jun 10, 2026", status: "completed" },
  { id: 6, coin: "ETH", type: "buy" as const, amount: 2.5, value: 8853.0, date: "Jun 09, 2026", status: "completed" },
];

const MARKET_NEWS = [
  { tag: "Market", title: "Bitcoin approaches all-time high as institutional demand surges", time: "2h ago", sentiment: "bullish" },
  { tag: "Analysis", title: "Ethereum's staking yield outperforms traditional bonds for Q2", time: "5h ago", sentiment: "bullish" },
  { tag: "Regulatory", title: "EU MiCA framework fully operational: crypto firms adapt fast", time: "8h ago", sentiment: "neutral" },
  { tag: "DeFi", title: "Solana DEX volume hits record $14B in 24 hours, fees compress", time: "12h ago", sentiment: "bullish" },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 2 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1400;
    const raf = (ts: number) => {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(ease * value);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{displayed.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

function Sparkline({ data, color, positive }: { data: number[]; color: string; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80; const h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#spark-${color.replace("#", "")})`} />
      <polyline points={points} stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DASH_INVESTMENT_OPTIONS = [
  { value: "", label: "Select investment amount…" },
  { value: "under_1000", label: "Under $1,000" },
  { value: "1000", label: "$1,000 – $4,999" },
  { value: "5000", label: "$5,000 – $9,999" },
  { value: "10000", label: "$10,000 – $24,999" },
  { value: "25000", label: "$25,000 – $49,999" },
  { value: "50000", label: "$50,000 – $99,999" },
  { value: "100000", label: "$100,000+" },
];

const DASH_COUNTRY_OPTIONS = [
  { value: "cy", label: "Cyprus" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "ae", label: "UAE" },
  { value: "sg", label: "Singapore" },
  { value: "au", label: "Australia" },
  { value: "other", label: "Other" },
];

interface DashForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  howMuchInvested: string;
  outlineCase: string;
}

const DASH_EMPTY: DashForm = {
  firstName: "", lastName: "", email: "", phone: "",
  country: "", howMuchInvested: "", outlineCase: "",
};

function DashboardContactForm() {
  const [form, setForm] = useState<DashForm>(DASH_EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof DashForm, string>>>({});
  const [apiError, setApiError] = useState("");

  const setF = (field: keyof DashForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof DashForm, string>> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.country) e.country = "Required";
    if (!form.howMuchInvested) e.howMuchInvested = "Required";
    if (!form.outlineCase.trim()) e.outlineCase = "Required";
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
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        howMuchInvested: form.howMuchInvested,
        outlineCase: form.outlineCase,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setApiError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass = (field: keyof DashForm) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-500/60" : "border-white/10"} bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10 transition-all duration-200`;

  return (
    <section className="relative py-20 border-t border-white/10">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Support
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-medium tracking-[-0.03em] text-white">
              Need help with your portfolio?
            </h2>
            <p className="mt-3 text-[14px] sm:text-[16px] text-white/50 leading-relaxed">
              Our investment advisors are available 24/7 to assist with your crypto strategy.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}>
                    <CheckCircle className="h-12 w-12 text-amber-400" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-[20px] font-medium text-white">Message received!</h3>
                  <p className="text-[13px] text-white/50 max-w-xs">Your advisor will reach out within 2 hours during market hours.</p>
                  <button
                    onClick={() => { setForm(DASH_EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                    className="mt-2 inline-flex h-9 items-center rounded-full border border-white/20 px-5 text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Name row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">First name *</label>
                      <input type="text" placeholder="John" value={form.firstName} onChange={setF("firstName")} className={inputClass("firstName")} />
                      {errors.firstName && <p className="mt-1 text-[11px] text-red-400">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Last name *</label>
                      <input type="text" placeholder="Doe" value={form.lastName} onChange={setF("lastName")} className={inputClass("lastName")} />
                      {errors.lastName && <p className="mt-1 text-[11px] text-red-400">{errors.lastName}</p>}
                    </div>
                  </div>
                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Email *</label>
                      <input type="email" placeholder="you@domain.com" value={form.email} onChange={setF("email")} className={inputClass("email")} />
                      {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Phone *</label>
                      <input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={setF("phone")} className={inputClass("phone")} />
                      {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>}
                    </div>
                  </div>
                  {/* Country + Investment */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Country *</label>
                      <select value={form.country} onChange={setF("country")} className={inputClass("country")}>
                        <option value="">Select country…</option>
                        {DASH_COUNTRY_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value} style={{ background: "#0f1218", color: "#fff" }}>{c.label}</option>
                        ))}
                      </select>
                      {errors.country && <p className="mt-1 text-[11px] text-red-400">{errors.country}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Additional investment *</label>
                      <select value={form.howMuchInvested} onChange={setF("howMuchInvested")} className={inputClass("howMuchInvested")}>
                        {DASH_INVESTMENT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value} style={{ background: "#0f1218", color: "#fff" }}>{o.label}</option>
                        ))}
                      </select>
                      {errors.howMuchInvested && <p className="mt-1 text-[11px] text-red-400">{errors.howMuchInvested}</p>}
                    </div>
                  </div>
                  {/* Outline case */}
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wide mb-2">Outline your case *</label>
                    <textarea rows={4} placeholder="Ask about trading strategies, portfolio rebalancing, tax optimization, or anything else…" value={form.outlineCase} onChange={setF("outlineCase")} className={`${inputClass("outlineCase")} resize-none`} />
                    {errors.outlineCase && <p className="mt-1 text-[11px] text-red-400">{errors.outlineCase}</p>}
                  </div>
                  {/* API error */}
                  {apiError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">{apiError}</div>
                  )}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-[11px] text-white/30">Encrypted & secure. Never shared.</p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-amber-400 px-5 text-[13px] font-semibold text-black hover:bg-amber-300 transition-colors disabled:opacity-60"
                    >
                      {status === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {status === "loading" ? "Sending…" : "Send message"}
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

// ─── Custom Tooltip ────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f1218] px-3 py-2 text-[12px] shadow-xl">
      <div className="text-white/40 mb-0.5">{label}</div>
      <div className="text-white font-medium">${payload[0].value.toLocaleString()}</div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"1W" | "1M" | "3M" | "1Y">("1M");
  const [notifOpen, setNotifOpen] = useState(false);

  const totalValue = CRYPTOS.reduce((s, c) => s + c.value, 0);
  const totalPnL = 24312.4;
  const pnlPct = 24.3;

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U";
  const displayName = user ? `${user.firstName} ${user.lastName[0]}.` : "Guest";

  return (
    <div className="min-h-screen bg-[#080b10] text-white font-['Inter_Tight',sans-serif] antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[140px]" />
        <div className="absolute top-[30%] right-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/4 blur-[100px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080b10]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] border border-amber-400/30 bg-amber-400/10 text-amber-400 text-[12px] font-bold">C</span>
            <span className="text-[15px] font-medium tracking-tight">Coffre</span>
            <span className="ml-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 uppercase tracking-wider">Pro</span>
          </div>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-1 py-1">
            {["Portfolio", "Markets", "Trade", "Analytics", "Earn"].map((item) => (
              <button
                key={item}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${item === "Portfolio" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-black">{initials}</div>
              <span className="text-[13px] text-white/80 hidden sm:block">{displayName}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 text-[13px] text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      <main className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-8 space-y-8">

        {/* ── Portfolio Overview ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Total value card */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 sm:p-7 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-amber-400/5 blur-[60px] -translate-y-1/2 translate-x-1/4" />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">Total Portfolio Value</div>
                <div className="text-[42px] sm:text-[52px] font-medium tracking-[-0.03em] leading-none text-white">
                  $<AnimatedNumber value={totalValue} decimals={2} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[12px] font-medium text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    +<AnimatedNumber value={pnlPct} decimals={2} suffix="%" />
                  </div>
                  <span className="text-[13px] text-white/40">
                    +$<AnimatedNumber value={totalPnL} decimals={2} /> this month
                  </span>
                </div>

                {/* Stats row */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">
                  {[
                    { label: "Total invested", value: "$93,356", sub: "Cost basis" },
                    { label: "Unrealized P&L", value: "+$24,312", sub: "All time", color: "text-green-400" },
                    { label: "Assets", value: "4 coins", sub: "Active positions" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{s.label}</div>
                      <div className={`text-[15px] font-medium ${s.color ?? "text-white"}`}>{s.value}</div>
                      <div className="text-[11px] text-white/30">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allocation pie */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">Allocation</div>
              <div className="flex justify-center">
                <PieChart width={160} height={160}>
                  <Pie data={ALLOCATION_DATA} cx={80} cy={80} innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value" stroke="none">
                    {ALLOCATION_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="mt-3 space-y-2">
                {ALLOCATION_DATA.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                      <span className="text-white/60">{a.name}</span>
                    </div>
                    <span className="text-white/80 font-medium tabular-nums">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Performance Chart ────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-1">Performance</div>
              <div className="text-[18px] font-medium text-white">Portfolio Growth</div>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
              {(["1W", "1M", "3M", "1Y"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${activeTab === t ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PORTFOLIO_HISTORY} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={42} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 4, fill: "#f59e0b", stroke: "#080b10", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.section>

        {/* ── Crypto Cards ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-medium text-white">Your Holdings</h2>
            <button className="text-[12px] text-white/40 hover:text-white transition-colors">View all markets →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {CRYPTOS.map((crypto, i) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm cursor-pointer hover:border-white/[0.14] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="grid h-9 w-9 place-items-center rounded-xl text-[16px] font-bold"
                      style={{ background: `${crypto.color}18`, color: crypto.color }}
                    >
                      {crypto.icon}
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-white">{crypto.symbol}</div>
                      <div className="text-[11px] text-white/40">{crypto.name}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${crypto.change >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {crypto.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {crypto.change >= 0 ? "+" : ""}{crypto.change}%
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-[22px] font-medium text-white tabular-nums">
                    ${crypto.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {crypto.held} {crypto.symbol} · ${crypto.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <Sparkline data={crypto.sparkline} color={crypto.color} positive={crypto.change >= 0} />

                {/* Live indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/25">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: crypto.color }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: crypto.color }} />
                  </span>
                  Live price
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Transactions + Market Intel ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-medium text-white">Recent Transactions</div>
              <button className="text-[12px] text-white/40 hover:text-white transition-colors">View all</button>
            </div>
            <div className="space-y-2">
              {TRANSACTIONS.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-8 w-8 place-items-center rounded-full ${tx.type === "buy" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      {tx.type === "buy" ? (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-white capitalize">{tx.type} {tx.coin}</div>
                      <div className="text-[11px] text-white/30">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[13px] font-medium tabular-nums ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                      {tx.type === "buy" ? "−" : "+"}${tx.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wide mt-0.5 ${tx.status === "completed" ? "text-white/30" : "text-amber-400"}`}>
                      {tx.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market intel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-medium text-white">Market Intel</div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
                Live
              </div>
            </div>
            <div className="space-y-3">
              {MARKET_NEWS.map((news, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 cursor-pointer hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                      news.sentiment === "bullish" ? "bg-green-500/10 text-green-400" :
                      news.sentiment === "bearish" ? "bg-red-500/10 text-red-400" :
                      "bg-white/5 text-white/30"
                    }`}>{news.tag}</span>
                    <span className="text-[10px] text-white/25">{news.time}</span>
                  </div>
                  <p className="text-[12px] text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">{news.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Feature Highlights ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/30 mb-2">Platform Features</div>
            <h2 className="text-[22px] font-medium text-white">Everything you need to invest smarter</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <Shield className="h-5 w-5" />, title: "Bank-grade Security", desc: "Multi-sig wallets, 2FA, cold storage" },
              { icon: <Zap className="h-5 w-5" />, title: "Real-time Trading", desc: "Sub-second execution on all pairs" },
              { icon: <BarChart3 className="h-5 w-5" />, title: "Advanced Analytics", desc: "AI-powered market signals & insights" },
              { icon: <Wallet className="h-5 w-5" />, title: "DeFi Integration", desc: "Access 500+ protocols seamlessly" },
              { icon: <Bitcoin className="h-5 w-5" />, title: "150+ Assets", desc: "Crypto, tokens, and derivatives" },
              { icon: <Globe className="h-5 w-5" />, title: "Global Coverage", desc: "Available in 80+ countries" },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
              >
                <div className="mt-0.5 text-amber-400 shrink-0">{feat.icon}</div>
                <div>
                  <div className="text-[13px] font-medium text-white">{feat.title}</div>
                  <div className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{feat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Contact Form ─────────────────────────────────────────── */}
        <DashboardContactForm />

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 mt-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/25">
          <div>© {new Date().getFullYear()} Coffre · All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
