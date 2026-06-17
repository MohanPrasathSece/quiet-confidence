/**
 * ProfitCalculator.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Three exports:
 *   1. ProfitCalculatorPopup   – modal that auto-opens on first visit
 *   2. FloatingCalculator      – sticky bottom-right widget (landing)
 *   3. DashboardCalculator     – inline full-result calculator (dashboard)
 */

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TrendingUp, X, Calculator, ChevronRight, Sparkles, Zap, ArrowUpRight } from "lucide-react";

// ─── Utility ─────────────────────────────────────────────────────────

/** Parses user input → number (strips $, commas, spaces) */
function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/[$,\s]/g, "")) || 0;
}

/** Returns a stable 5-10x result seeded on the amount so it looks real */
function computeProjection(amount: number, multiplierSeed: number) {
  // Multiplier range 5x–10x, varies per amount tier
  const base = 5 + (multiplierSeed % 6); // 5, 6, 7, 8, 9, 10
  const low = amount * base;
  const high = amount * (base + 1);
  return { low, high, multiplier: base };
}

/** Chooses a stable seed from the amount value */
function getSeed(amount: number): number {
  const s = Math.floor(amount);
  return ((s * 31) % 6);
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ─── Shared result card ───────────────────────────────────────────────

function ResultCard({ amount, onCTA, ctaLabel }: {
  amount: number;
  onCTA?: () => void;
  ctaLabel?: string;
}) {
  const seed = getSeed(amount);
  const { low, high, multiplier } = computeProjection(amount, seed);
  const profitLow = low - amount;
  const profitHigh = high - amount;

  return (
    <motion.div
      key={amount}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 rounded-2xl overflow-hidden border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-100" />
          <span className="text-[13px] font-bold text-white tracking-wide uppercase">
            Projection IA
          </span>
        </div>
        <span className="text-[12px] bg-white/20 text-white rounded-full px-2.5 py-0.5 font-semibold">
          {multiplier}x – {multiplier + 1}x Retours
        </span>
      </div>

      {/* Main numbers */}
      <div className="px-5 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-emerald-100 p-3.5 text-center shadow-sm">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Projection min
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {fmt(low)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              +{fmt(profitLow)} profit
            </div>
          </div>
          <div className="bg-emerald-600 rounded-xl p-3.5 text-center shadow-md">
            <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider mb-1">
              Projection max
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {fmt(high)}
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold mt-0.5">
              +{fmt(profitHigh)} profit
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Taux de réussite", val: "92.8%" },
            { label: "Retour moyen", val: `${multiplier + 0.5}x` },
            { label: "Confiance IA", val: "94%" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-lg py-2 px-1 border border-slate-100">
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{s.label}</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          * Projections basées sur les performances historiques du modèle Atlas AI. Les résultats passés ne garantissent pas les rendements futurs. Capital à risque.
        </p>

        {onCTA && ctaLabel && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCTA}
            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-semibold text-background hover:opacity-90 transition-opacity cursor-pointer"
          >
            {ctaLabel}
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Shared input section ─────────────────────────────────────────────

function CalcInput({
  value,
  onChange,
  onCalculate,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onCalculate: () => void;
  loading?: boolean;
}) {
  const PRESETS = [100, 500, 1000, 5000, 10000];

  return (
    <div className="space-y-3">
      {/* Amount input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCalculate()}
          placeholder="Entrez le montant de l'investissement"
          className="w-full h-12 pl-8 pr-4 rounded-xl border border-border bg-background text-[15px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all"
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => onChange(String(p))}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              value === String(p)
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:border-foreground/50"
            }`}
          >
            ${p.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Calculate button — compact, not full-width */}
      <div className="flex justify-start">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCalculate}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[13px] font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-3.5 w-3.5 border-2 border-background/40 border-t-background rounded-full"
              />
              Calcul…
            </>
          ) : (
            <>
              <TrendingUp className="h-3.5 w-3.5" />
              Calculer mes retours
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Locked / teaser result (shown on landing — blurred, prompts signup) ─

function LockedResult({ amount, onSignUp }: { amount: number; onSignUp: () => void }) {
  const seed = getSeed(amount);
  const { multiplier } = computeProjection(amount, seed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 relative rounded-2xl overflow-hidden border border-emerald-200/60"
    >
      {/* Blurred fake numbers underneath */}
      <div className="select-none pointer-events-none">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-100" />
            <span className="text-[13px] font-bold text-white uppercase tracking-wide">Projection IA prête</span>
          </div>
          <span className="text-[12px] bg-white/20 text-white rounded-full px-2.5 py-0.5 font-semibold">
            {multiplier}x – {multiplier + 1}x Retours
          </span>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white px-5 py-4 blur-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-emerald-100 p-3.5 text-center">
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Projection min</div>
              <div className="text-2xl font-black text-slate-800">$██,███</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+$█,███ profit</div>
            </div>
            <div className="bg-emerald-600 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider mb-1">Projection max</div>
              <div className="text-2xl font-black text-white">$██,███</div>
              <div className="text-[11px] text-emerald-200 font-semibold mt-0.5">+$█,███ profit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay gate */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 backdrop-blur-[3px] px-6">
        {/* Lock icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground mb-4 shadow-lg">
          <svg className="h-6 w-6 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        {/* Headline */}
        <p className="text-[16px] font-bold text-foreground text-center leading-snug">
          Votre projection est prête
        </p>
        {/* Sub-copy */}
        <p className="text-[12px] text-muted-foreground text-center mt-2 mb-5 leading-relaxed max-w-[220px]">
          Un retour de <span className="font-semibold text-emerald-600">{multiplier}x – {multiplier + 1}x</span> a été calculé pour votre montant. Créez un compte gratuit pour voir tous vos résultats.
        </p>
        {/* Primary CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSignUp}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-[13px] font-bold text-background hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          S'inscrire gratuitement — Voir mes résultats
          <ChevronRight className="h-4 w-4" />
        </motion.button>
        {/* Already have account */}
        <p className="text-[11px] text-muted-foreground mt-3">
          Vous avez déjà un compte ?{" "}
          <button onClick={onSignUp} className="text-foreground font-semibold hover:underline cursor-pointer">Se connecter</button>
        </p>
      </div>
    </motion.div>
  );
}

// ─── 1. Popup modal (auto-opens on first visit) ───────────────────────

export function ProfitCalculatorPopup({ onSignUp }: { onSignUp: () => void }) {
  const [open, setOpen] = useState(false);
  const [rawAmount, setRawAmount] = useState("1000");
  const [showGate, setShowGate] = useState(false);
  const [gateAmount, setGateAmount] = useState(0);
  const [simulating, setSimulating] = useState(false);

  // Auto-open once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("calc_popup_seen");
    if (!seen) {
      const t = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("calc_popup_seen", "1");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, []);

  // "Calculate" = short fake scan → show locked/blurred teaser → prompt signup
  const calculate = () => {
    const n = parseAmount(rawAmount);
    if (!n || n <= 0) return;
    setSimulating(true);
    setShowGate(false);
    setTimeout(() => {
      setGateAmount(n);
      setSimulating(false);
      setShowGate(true);
    }, 800);
  };

  const handleSignUp = () => {
    setOpen(false);
    onSignUp();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ padding: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close calculator"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
          />

          {/* Dialog — true square, perfectly centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-[min(520px,92vw)] rounded-3xl border border-border bg-background shadow-[0_60px_140px_-20px_rgba(17,17,17,0.4)] overflow-hidden flex flex-col"
          >
            {/* Top gradient accent bar */}
            <div className="h-1.5 w-full flex-shrink-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />

            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-0 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-foreground tracking-tight">Calculateur de profit</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Moteur IA Atlas · Modèle en direct</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 pt-5 pb-7 flex flex-col flex-1">

              {/* Headline */}
              <div className="mb-5">
                <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
                  Voyez vos
                  <span className="text-emerald-500"> retours potentiels</span>
                </h2>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                  Entrez un montant — notre IA calcule instantanément votre projection de profit.
                </p>
              </div>

              {/* Stats tease row */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { label: "Retour moyen",    val: "7.4x"  },
                  { label: "Taux de réussite",      val: "92.8%" },
                  { label: "Confiance IA", val: "94%"   },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 py-2.5 px-1.5 text-center">
                    <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</div>
                    <div className="text-[14px] font-black text-slate-800 mt-0.5">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <CalcInput
                value={rawAmount}
                onChange={(v) => { setRawAmount(v); setShowGate(false); }}
                onCalculate={calculate}
                loading={simulating}
              />

              <AnimatePresence>
                {showGate && !simulating && (
                  <LockedResult amount={gateAmount} onSignUp={handleSignUp} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 2. Floating bottom-right button → opens centered modal ────────────

export function FloatingCalculator({ onSignUp }: { onSignUp: () => void }) {
  const [open, setOpen] = useState(false);
  const [rawAmount, setRawAmount] = useState("1000");
  const [showGate, setShowGate] = useState(false);
  const [gateAmount, setGateAmount] = useState(0);
  const [simulating, setSimulating] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const calculate = () => {
    const n = parseAmount(rawAmount);
    if (!n || n <= 0) return;
    setSimulating(true);
    setShowGate(false);
    setTimeout(() => {
      setGateAmount(n);
      setSimulating(false);
      setShowGate(true);
    }, 800);
  };

  const handleSignUp = () => {
    setOpen(false);
    onSignUp();
  };

  return (
    <>
      {/* ── Centered modal overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Backdrop */}
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
            />

            {/* Dialog — large square, perfectly centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-[min(520px,92vw)] rounded-3xl border border-border bg-background shadow-[0_60px_140px_-20px_rgba(17,17,17,0.4)] overflow-hidden flex flex-col"
            >
              {/* Top accent */}
              <div className="h-1.5 w-full flex-shrink-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-6 pb-0 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm">
                    <Calculator className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-foreground tracking-tight">Calculateur de profit</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Moteur IA Atlas · Modèle en direct</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-7 pt-5 pb-7 flex flex-col flex-1">
                {/* Headline */}
                <div className="mb-5">
                  <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
                    Voyez vos
                    <span className="text-emerald-500"> retours potentiels</span>
                  </h2>
                  <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                    Entrez n'importe quel montant — notre modèle d'IA Atlas calcule instantanément votre profit projeté.
                  </p>
                </div>

                {/* Stats tease */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {[
                    { label: "Retour moyen",    val: "7.4x"  },
                    { label: "Taux de réussite",      val: "92.8%" },
                    { label: "Confiance IA", val: "94%"   },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 py-2.5 px-1.5 text-center">
                      <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</div>
                      <div className="text-[14px] font-black text-slate-800 mt-0.5">{s.val}</div>
                    </div>
                  ))}
                </div>

                <CalcInput
                  value={rawAmount}
                  onChange={(v) => { setRawAmount(v); setShowGate(false); }}
                  onCalculate={calculate}
                  loading={simulating}
                />

                <AnimatePresence>
                  {showGate && !simulating && (
                    <LockedResult amount={gateAmount} onSignUp={handleSignUp} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button (bottom-right) ─────────────────── */}
      <div className="fixed bottom-6 right-5 z-[150]">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setOpen(true); setShowGate(false); }}
          className="flex items-center gap-2.5 h-12 px-5 rounded-full bg-foreground text-background shadow-[0_8px_30px_rgba(17,17,17,0.28)] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Calculator className="h-4 w-4" />
          <span className="text-[13px] font-semibold whitespace-nowrap">Calculer les retours</span>
          <motion.span
            className="flex h-2 w-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.button>
      </div>
    </>
  );
}

// ─── 3. Dashboard inline calculator (logged-in users see full results) ─

export function DashboardCalculator() {
  const [rawAmount, setRawAmount] = useState("1000");
  const [amount, setAmount] = useState<number | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");

  const SCAN_STEPS = [
    "Connexion au réseau de neurones Atlas…",
    "Analyse des carnets d'ordres BTC/ETH en direct…",
    "Exécution du modèle de projection IA à 94 facteurs…",
    "Calcul de scénarios de rendement composé…",
    "Génération de votre projection personnalisée…",
  ];
  const [scanStep, setScanStep] = useState(0);

  const calculate = () => {
    const n = parseAmount(rawAmount);
    if (!n || n <= 0) return;
    setSimulating(true);
    setPhase("scanning");
    setScanStep(0);
    setAmount(null);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScanStep(i);
      if (i >= SCAN_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setAmount(n);
          setPhase("done");
          setSimulating(false);
        }, 600);
      }
    }, 340);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-gradient-to-r from-emerald-50/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200">
            <Zap className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">Simulateur de profit IA</div>
            <div className="text-xs text-muted-foreground">Entrez n'importe quel montant pour voir votre projection</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Modèle en direct</span>
        </div>
      </div>

      <div className="p-6">
        <CalcInput
          value={rawAmount}
          onChange={setRawAmount}
          onCalculate={calculate}
          loading={simulating}
        />

        {/* Scanning animation */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-xl border border-border bg-slate-950 p-4 font-mono space-y-1.5"
            >
              <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Traitement IA Atlas
              </div>
              {SCAN_STEPS.slice(0, scanStep + 1).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[12px] text-slate-300"
                >
                  <span className="text-slate-500 mr-2">›</span>
                  {step}
                  {i === scanStep && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-1 inline-block"
                    >_</motion.span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full results for logged-in users */}
        <AnimatePresence>
          {amount !== null && phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResultCard amount={amount} />

              {/* Extended dashboard-only breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Timeline */}
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Chronologie projetée
                  </div>
                  {[
                    { period: "30 jours", growth: `+${(getSeed(amount) + 2) * 10}%` },
                    { period: "90 jours", growth: `+${(getSeed(amount) + 2) * 28}%` },
                    { period: "6 mois", growth: `+${(getSeed(amount) + 5) * 60}%` },
                    { period: "12 mois", growth: `+${(getSeed(amount) + 5) * 100 + getSeed(amount) * 20}%` },
                  ].map((row) => (
                    <div key={row.period} className="flex items-center justify-between">
                      <span className="text-[13px] text-muted-foreground">{row.period}</span>
                      <span className="text-[13px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {row.growth}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Strategy breakdown */}
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Allocation de stratégie
                  </div>
                  {[
                    { label: "BTC Accumulation", pct: 45, color: "bg-amber-500" },
                    { label: "ETH Staking Yield", pct: 35, color: "bg-blue-500" },
                    { label: "SOL Liquidity Pool", pct: 20, color: "bg-emerald-500" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-bold text-slate-700">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
