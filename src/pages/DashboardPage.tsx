import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";
import { submitLead } from "@/lib/crmApi";
import { DashboardCalculator } from "@/components/ProfitCalculator";
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
  LineChart,
  Layers,
} from "lucide-react";

// ─── Types & Interfaces ────────────────────────────────────────────────────

interface DashForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
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

// ─── Visual Candle Chart Mockup ─────────────────────────────────────────────

function MacBookCandleMockup() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState(67842.5);
  const [prevClose, setPrevClose] = useState(67842.5);

  // Generate initial candles (30 candles)
  useEffect(() => {
    const initialCandles: Candle[] = [];
    let basePrice = 67300;
    for (let i = 0; i < 30; i++) {
      const open = basePrice + (Math.random() - 0.5) * 120;
      const close = open + (Math.random() - 0.5) * 180;
      const high = Math.max(open, close) + Math.random() * 60;
      const low = Math.min(open, close) - Math.random() * 60;
      initialCandles.push({
        open,
        close,
        high,
        low,
        time: `${10 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
      });
      basePrice = close;
    }
    setCandles(initialCandles);
    setLivePrice(basePrice);
    setPrevClose(basePrice);
  }, []);

  // Fluctuate live price
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setLivePrice((prev) => {
        const delta = (Math.random() - 0.5) * 35;
        return Number((prev + delta).toFixed(2));
      });
    }, 400);

    return () => clearInterval(liveInterval);
  }, []);

  // Push new candle and remove oldest every 4.5 seconds
  useEffect(() => {
    const candleInterval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        const nextOpen = lastCandle.close;
        const nextClose = livePrice;
        const nextHigh = Math.max(nextOpen, nextClose) + Math.random() * 50;
        const nextLow = Math.min(nextOpen, nextClose) - Math.random() * 50;
        
        const newCandle: Candle = {
          open: nextOpen,
          close: nextClose,
          high: nextHigh,
          low: nextLow,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        };
        
        return [...prev.slice(1), newCandle];
      });
      setPrevClose(livePrice);
    }, 4500);

    return () => clearInterval(candleInterval);
  }, [livePrice]);

  // Coordinate scales
  const chartHeight = 220;
  
  const minPrice = Math.min(...candles.map((c) => c.low), livePrice) - 40;
  const maxPrice = Math.max(...candles.map((c) => c.high), livePrice) + 40;
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => 25 + index * 19;
  const getY = (price: number) => chartHeight - 20 - ((price - minPrice) / priceRange) * (chartHeight - 40);

  const isUp = livePrice >= prevClose;

  return (
    <div className="w-full rounded-2xl bg-card border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* MacBook macOS Window controls */}
      <div className="bg-slate-50/80 border-b border-border/50 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 text-center">
          <div className="mx-auto max-w-xs bg-slate-100/80 border border-slate-200/50 rounded text-[15px] text-muted-foreground/80 py-0.5 px-2 font-mono truncate">
            atlasledger.ai/terminal/live-market
          </div>
        </div>
      </div>

      {/* Taller Candlestick Screen */}
      <div className="p-5 sm:p-6 bg-slate-950 text-white font-mono space-y-4">
        {/* Live Ticker Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[15px] font-bold text-slate-100 tracking-wider">BTC / USD LIVE</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
              ${livePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-[15px] font-semibold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
              {isUp ? "▲" : "▼"} 1.48%
            </span>
          </div>
        </div>

        {/* Dynamic Candlestick Chart SVG - Taller Height h-64 */}
        <div className="relative h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 620 240" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="40" x2="580" y2="40" stroke="rgba(255,255,255,0.03)" strokeDasharray="2 2" />
            <line x1="0" y1="90" x2="580" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="2 2" />
            <line x1="0" y1="140" x2="580" y2="140" stroke="rgba(255,255,255,0.03)" strokeDasharray="2 2" />
            <line x1="0" y1="190" x2="580" y2="190" stroke="rgba(255,255,255,0.03)" strokeDasharray="2 2" />

            {/* Grid Price Labels on right */}
            <text x="590" y="44" className="text-[15px] fill-slate-600 font-sans">
              ${(maxPrice - priceRange * 0.1).toFixed(0)}
            </text>
            <text x="590" y="94" className="text-[15px] fill-slate-600 font-sans">
              ${(maxPrice - priceRange * 0.35).toFixed(0)}
            </text>
            <text x="590" y="144" className="text-[15px] fill-slate-600 font-sans">
              ${(maxPrice - priceRange * 0.6).toFixed(0)}
            </text>
            <text x="590" y="194" className="text-[15px] fill-slate-600 font-sans">
              ${(maxPrice - priceRange * 0.85).toFixed(0)}
            </text>

            {/* Render 30 Candlesticks */}
            {candles.map((candle, idx) => {
              const x = getX(idx);
              const yOpen = getY(candle.open);
              const yClose = getY(idx === candles.length - 1 ? livePrice : candle.close);
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);
              const cUp = (idx === candles.length - 1 ? livePrice : candle.close) >= candle.open;

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={cUp ? "#10b981" : "#f43f5e"} strokeWidth="1.5" />
                  {/* Real market size body (width 12) */}
                  <rect
                    x={x - 6}
                    y={Math.min(yOpen, yClose)}
                    width="12"
                    height={Math.max(2, Math.abs(yOpen - yClose))}
                    fill={cUp ? "#10b981" : "#f43f5e"}
                    stroke={cUp ? "#059669" : "#e11d48"}
                    strokeWidth="1"
                    rx="1"
                  />
                </g>
              );
            })}

            {/* Live Price Horizontal Line */}
            {candles.length > 0 && (
              <g>
                <line
                  x1="0"
                  y1={getY(livePrice)}
                  x2="580"
                  y2={getY(livePrice)}
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <circle cx={getX(candles.length - 1)} cy={getY(livePrice)} r="3.5" fill="#10b981" />
              </g>
            )}
          </svg>
        </div>

        {/* Info stats bar */}
        <div className="grid grid-cols-3 gap-2 text-[15px] text-slate-500 pt-3 border-t border-slate-900">
          <div>
            <span className="block uppercase text-[15px] tracking-wider">24H High</span>
            <span className="font-semibold text-slate-300">$68,140.25</span>
          </div>
          <div>
            <span className="block uppercase text-[15px] tracking-wider">24H Low</span>
            <span className="font-semibold text-slate-300">$66,950.00</span>
          </div>
          <div>
            <span className="block uppercase text-[15px] tracking-wider">AI Confidence</span>
            <span className="font-semibold text-emerald-400">94.2% BUY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Engine Weight & Log Visualizer ──────────────────────────────────────

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
    }, 4200);

    return () => clearInterval(logInterval);
  }, []);

  // Fluctuates weights slightly to look active
  useEffect(() => {
    const weightInterval = setInterval(() => {
      setBtcWeight((prev) => Math.max(40, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1))));
      setEthWeight((prev) => Math.max(30, Math.min(40, prev + (Math.random() > 0.5 ? 1 : -1))));
      setSolWeight((prev) => Math.max(15, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3200);

    return () => clearInterval(weightInterval);
  }, []);

  return (
    <div className="w-full bg-slate-50/70 rounded-2xl border border-slate-100/80 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Visual Scanning Node Network */}
      <div className="h-36 w-full bg-white rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 300 130" className="w-full h-full text-slate-300">
          {/* Animated Connecting Lines */}
          <g stroke="#e2e8f0" strokeWidth="1.5">
            <motion.line x1="150" y1="65" x2="60" y2="30"
              animate={{ stroke: ["#e2e8f0", "#f59e0b", "#e2e8f0"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.line x1="150" y1="65" x2="240" y2="35"
              animate={{ stroke: ["#e2e8f0", "#3b82f6", "#e2e8f0"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            />
            <motion.line x1="150" y1="65" x2="150" y2="105"
              animate={{ stroke: ["#e2e8f0", "#10b981", "#e2e8f0"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </g>

          {/* Central AI Engine Node */}
          <motion.circle cx="150" cy="65" r="15" fill="#fafafa" stroke="#1e293b" strokeWidth="2"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="150" y="68" textAnchor="middle" className="text-[8px] font-bold fill-slate-800 tracking-wider font-mono">
            ATLAS
          </text>

          {/* Orbiting Asset Nodes */}
          {/* BTC */}
          <circle cx="60" cy="30" r="12" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
          <text x="60" y="33" textAnchor="middle" className="text-[7px] font-bold fill-amber-600 font-mono">BTC</text>
          
          {/* ETH */}
          <circle cx="240" cy="35" r="12" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
          <text x="240" y="38" textAnchor="middle" className="text-[7px] font-bold fill-blue-600 font-mono">ETH</text>

          {/* SOL */}
          <circle cx="150" cy="105" r="12" fill="#fff" stroke="#10b981" strokeWidth="2" />
          <text x="150" y="108" textAnchor="middle" className="text-[7px] font-bold fill-emerald-600 font-mono">SOL</text>
        </svg>

        {/* Pulse Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-500/[0.01] to-transparent pointer-events-none" />
      </div>

      {/* Asset Weights & Confidence Scores */}
      <div className="space-y-3 bg-white rounded-xl border border-slate-100 p-4">
        <div className="text-[15px] font-bold uppercase tracking-wider text-slate-400">
          Target Asset Weights
        </div>
        <div className="space-y-2.5">
          {/* BTC */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-base">
              <span className="font-semibold text-slate-700">Bitcoin (BTC)</span>
              <span className="font-mono text-amber-600 font-bold">{btcWeight}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${btcWeight}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          {/* ETH */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-base">
              <span className="font-semibold text-slate-700">Ethereum (ETH)</span>
              <span className="font-mono text-blue-600 font-bold">{ethWeight}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${ethWeight}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          {/* SOL */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-base">
              <span className="font-semibold text-slate-700">Solana (SOL)</span>
              <span className="font-mono text-emerald-600 font-bold">{solWeight}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-base text-slate-300 space-y-1.5 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[15px] uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Logs
          </span>
        </div>
        <div className="space-y-1 h-20 overflow-hidden flex flex-col justify-start">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="truncate"
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
    if (!form.name.trim()) e.name = "Requis";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail valide requis";
    if (!form.phone.trim()) e.phone = "Requis";
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
      setApiError("Un problème est survenu. Veuillez réessayer.");
      setStatus("error");
    }
  };

  const inputClass = (field: keyof DashForm) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-400" : "border-border"} bg-background/60 px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all duration-200 backdrop-blur-sm`;

  return (
    <div className="mx-auto max-w-3xl pt-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[15px] text-muted-foreground font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          Service d'assistance
        </div>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
          Parlez à notre équipe de stratégie
        </h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Nos bureaux de négociation peuvent vous aider à construire des allocations privées, des intégrations d'API et des règles de rééquilibrage personnalisées.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_60px_-20px_rgba(17,17,17,0.05)]">
        <AnimatePresence mode="wait">
          {/* Success */}
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center gap-3 py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-12 w-12 text-foreground" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-medium tracking-tight text-foreground">Demande reçue</h3>
              <p className="text-base text-muted-foreground max-w-xs leading-relaxed">
                Un conseiller vous contactera dans les 2 heures pendant les sessions de marché actives.
              </p>
              <button
                onClick={() => { setForm(DASH_EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                className="mt-3 inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-base font-medium text-foreground hover:bg-accent transition-colors"
              >
                Envoyer un autre message
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
                <label className="block text-[15px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Nom *</label>
                <input type="text" placeholder="John Doe" value={form.name} onChange={setF("name")} className={inputClass("name")} />
                {errors.name && <p className="mt-1 text-[15px] text-red-500">{errors.name}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[15px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Adresse e-mail *</label>
                  <input type="email" placeholder="you@domain.com" value={form.email} onChange={setF("email")} className={inputClass("email")} />
                  {errors.email && <p className="mt-1 text-[15px] text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[15px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Numéro de téléphone *</label>
                  <input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={setF("phone")} className={inputClass("phone")} />
                  {errors.phone && <p className="mt-1 text-[15px] text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[15px] font-semibold text-foreground uppercase tracking-wide mb-1.5">Message (facultatif)</label>
                <textarea
                  rows={4}
                  placeholder="Précisez votre allocation cible, les valeurs du portefeuille sous-jacent ou vos questions techniques..."
                  value={form.message}
                  onChange={setF("message")}
                  className={`${inputClass("message")} resize-none`}
                />
              </div>

              {/* API error */}
              {apiError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                  {apiError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <p className="text-base text-muted-foreground font-mono">Toutes les métriques et discussions restent strictement confidentielles.</p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {status === "loading" ? "Envoi..." : "Envoyer le message"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Scroll to top on mount (e.g. after login redirect)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
          {/* Logo - clicking scrolls to top smoothly */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex shrink-0 items-center gap-2 text-base font-medium tracking-tight cursor-pointer focus:outline-none"
          >
            <Logo className="h-5 w-5 text-foreground" />
            <span>AtlasLedger</span>
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-7 text-base text-muted-foreground">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium focus:outline-none cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>
        </div>
      </motion.header>

      {/* ── Main Content (Generous vertical space: space-y-28 sm:space-y-32, py-20 sm:py-24) ── */}
      <main className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-20 sm:py-24 space-y-28 sm:space-y-32">
        
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="relative"
        >
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1 text-[15px] text-muted-foreground font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Espace de travail sécurisé autorisé
            </div>
              Bonjour, {user?.firstName || "Investisseur"}.
              Bienvenue sur la plateforme institutionnelle AtlasLedger. Nous vous aidons à investir dans les bonnes opportunités de crypto-monnaie en tirant parti de notre **Moteur IA-Quantique Atlas** de pointe. Nos systèmes automatisés évaluent les déclencheurs de volume, les écarts de prix et les indicateurs de tendance structurelle en temps réel pour optimiser l'entrée, les allocations de garde et les pondérations d'actifs.
          </div>
        </motion.section>

        {/* ── Profit Calculator Section ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Votre simulateur de profit personnel
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Exécutez une projection IA en direct sur n'importe quel montant d'investissement et consultez vos prévisions de rendement personnalisées.
            </p>
          </div>
          <DashboardCalculator />
        </motion.section>

        {/* ── Main AI Bot Section ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Stratégie d'investissement crypto propulsée par l'IA
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Comprenez comment notre plateforme d'automatisation propriétaire sécurise et optimise votre exposition aux actifs numériques.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-4">
            {/* Text Specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-[15px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/30">
                <Brain className="h-3.5 w-3.5" />
                Moteur quantitatif actif
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
                Le moteur IA-quantique Atlas
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Plutôt que de s'appuyer sur des conseils spéculatifs ou une exécution manuelle, AtlasLedger déploie un modèle de réseau neuronal unifié pour naviguer sur les marchés liquides des crypto-monnaies. Le bot IA suit en permanence la volatilité des prix, les déséquilibres des transactions et les métriques d'activité des développeurs pour allouer les fonds vers les actifs de la plus haute qualité (BTC, ETH et certains protocoles blue-chip).
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">Sélection de cible</h4>
                    <p className="text-base text-muted-foreground mt-0.5">Analyse les spreads institutionnels, la santé du réseau et la vélocité pour allouer uniquement aux jetons vérifiés avec de solides vents favorables fondamentaux.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">Allocation des risques</h4>
                    <p className="text-base text-muted-foreground mt-0.5">Exécute une couverture neutre en delta et un rééquilibrage stop-drift pour défendre le capital contre les baisses et les glissements du marché.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">Composition des rendements</h4>
                    <p className="text-base text-muted-foreground mt-0.5">Achemine les allocations de pools stables vers des hubs de staking liquide efficaces en capital pour capturer automatiquement des rendements élevés.</p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/40">
                <div>
                  <div className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">Cible principale</div>
                  <div className="text-base font-bold text-slate-800 mt-1">Surperformance BTC & ETH</div>
                </div>
                <div>
                  <div className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">Évaluation des risques</div>
                  <div className="text-base font-bold text-slate-800 mt-1">Faible / Couvert</div>
                </div>
                <div>
                  <div className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">Vitesse de scan IA</div>
                  <div className="text-base font-bold text-slate-800 mt-1">&lt;12ms latency</div>
                </div>
                <div>
                  <div className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground">Spécification d'exécution</div>
                  <div className="text-base font-bold text-slate-800 mt-1">Rééquilibrage automatique</div>
                </div>
              </div>
            </div>

            {/* Animation Weight Widget */}
            <div className="lg:col-span-5 self-start">
              <AIEngineAnimation />
            </div>
          </div>
        </motion.section>

        {/* ── macOS MacBook Mockup with Taller Candlestick Chart ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Visualiseur d'exécution de stratégie en direct
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Calculs de chandeliers en temps réel générés directement à partir de nos instances algorithmiques actives.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <MacBookCandleMockup />
          </div>
        </motion.section>

        {/* ── Performance Metrics Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Mesures de performance du moteur
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Indices de performance statistiques générés à partir de modèles actifs historiques et backtestés.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <LineChart className="h-5 w-5 text-amber-500" />, title: "Ratio de Sharpe", val: "2.84", desc: "Indice de rendement ajusté au risque" },
              { icon: <Activity className="h-5 w-5 text-emerald-500" />, title: "Taux de réussite", val: "92.8%", desc: "Transactions clôturées avec marge" },
              { icon: <TrendingUp className="h-5 w-5 text-blue-500" />, title: "Ratio de Sortino", val: "3.12", desc: "Modificateur de risque de baisse" },
              { icon: <ShieldCheck className="h-5 w-5 text-slate-700" />, title: "Baisse maximale", val: "-4.15%", desc: "Limite de baisse du sommet au creux" },
              { icon: <Layers className="h-5 w-5 text-purple-500" />, title: "Total composé", val: "+142.4%", desc: "Rendement cumulatif pluriannuel" },
            ].map((metric, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-muted-foreground uppercase tracking-wider">{metric.title}</span>
                  {metric.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{metric.val}</div>
                  <p className="text-[15px] text-muted-foreground leading-snug mt-1">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Staking/Investment Pipeline ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Processus d'investissement automatisé
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Quatre phases systématiques garantissant que vos fonds s'alignent en toute sécurité sur les tendances maximales de la crypto-monnaie.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { num: "01", name: "Analyse du marché", desc: "Le moteur exécute des analyses inférieures à la seconde sur les indicateurs sociaux, les transactions de blocs L1 et les spreads d'échanges centralisés." },
              { num: "02", name: "Étalonnage du poids", desc: "Les allocations s'ajustent dynamiquement sur les actifs cryptographiques sélectionnés, en inclinant le poids vers les jetons avec des signaux d'achat confirmés." },
              { num: "03", name: "Jalonnement neutre en delta", desc: "Les paires de liquidités de stablecoins balaient les rendements cross-dex, générant des retours sur les frais tout en atténuant l'exposition globale à la direction du marché." },
              { num: "04", name: "Rééquilibrage automatique", desc: "Si la dérive de l'actif sous-jacent dépasse 1,5 % par rapport à la ligne de base du modèle, le bot exécute automatiquement les ordres de rééquilibrage." },
            ].map((step, i) => (
              <div key={i} className="relative p-6 rounded-xl border border-border/60 bg-slate-50/20 space-y-3">
                <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-mono tracking-tight select-none">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-800">{step.name}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Supported Verified Asset Pools ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-8"
        >
          <div className="border-b border-border/60 pb-6">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Pools d'actifs cryptographiques vérifiés
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
              Cryptomonnaies activement suivies et allouées par le modèle Atlas AI.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { coin: "Bitcoin", symbol: "BTC", buy: "94.2%", status: "Allocation active", color: "border-amber-200 bg-amber-50/20 text-amber-700" },
              { coin: "Ethereum", symbol: "ETH", buy: "88.5%", status: "Allocation active", color: "border-blue-200 bg-blue-50/20 text-blue-700" },
              { coin: "Solana", symbol: "SOL", buy: "82.1%", status: "Allocation active", color: "border-emerald-200 bg-emerald-50/20 text-emerald-700" },
              { coin: "Chainlink", symbol: "LINK", buy: "76.4%", status: "Pool couvert", color: "border-indigo-200 bg-indigo-50/20 text-indigo-700" },
              { coin: "Polkadot", symbol: "DOT", buy: "71.2%", status: "Surveillance", color: "border-pink-200 bg-pink-50/20 text-pink-700" },
              { coin: "Uniswap", symbol: "UNI", buy: "68.9%", status: "Surveillance", color: "border-purple-200 bg-purple-50/20 text-purple-700" },
            ].map((asset, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3 text-center flex flex-col justify-between">
                <div className="text-[15px] font-bold text-slate-400 font-mono tracking-wider">{asset.symbol}</div>
                <div className="space-y-1">
                  <div className="text-base font-extrabold text-slate-800">{asset.coin}</div>
                  <div className="text-2xl font-black text-slate-800">{asset.buy}</div>
                  <div className="text-[15px] text-muted-foreground">Force d'achat IA</div>
                </div>
                <div className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[15px] font-bold uppercase ${asset.color}`}>
                  {asset.status}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Contact Form ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <DashboardContactForm />
        </motion.section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 mt-12 relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-base text-muted-foreground">
          <div>© {new Date().getFullYear()} AtlasLedger · Tous droits réservés.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
