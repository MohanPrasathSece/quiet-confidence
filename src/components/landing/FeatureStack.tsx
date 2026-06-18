import { motion, useMotionValue, useTransform, MotionValue } from "motion/react";
import { useRef, useEffect } from "react";
import { Reveal } from "./primitives";

const features = [
  {
    tag: "01 - Trading Web3",
    title: "Une exécution à la vitesse de la lumière.",
    body:
      "Routage intelligent sur les exchanges décentralisés (DEX) et centralisés (CEX) avec une latence quasi nulle. Exécution parfaite.",
    bullets: ["Carnet d'ordres multi-DEX", "Routage déterministe à 12 ms", "Exécution algorithmique on-chain"],
  },
  {
    tag: "02 - Analytique Crypto",
    title: "Des métriques qui comptent.",
    body:
      "Analyses de portefeuille DeFi, de risque et d'attribution en temps réel. Suivi complet des wallets et des contrats intelligents.",
    bullets: ["P&L en continu (Live)", "Analyse des Gas Fees", "Reporting automatisé"],
  },
  {
    tag: "03 - Sécurité On-chain",
    title: "Une forteresse numérique.",
    body:
      "Garde MPC, intégration hardware wallet et politiques de multisig conçues par les meilleurs experts en sécurité crypto.",
    bullets: ["Garde MPC avancée", "Politiques Multisig (Quorum)", "Audits Smart Contracts"],
  },
  {
    tag: "04 - Smart Automation",
    title: "Un portefeuille autonome.",
    body:
      "Règles programmables pour le yield farming, le staking et le rééquilibrage. Écrivez le code, le réseau fait le reste.",
    bullets: ["Moteur de règles (Smart Contracts)", "Webhooks & API Web3", "Auto-Compound intégré"],
  },
];

export function FeatureStack() {
  const ref = useRef<HTMLDivElement>(null);
  const progressVal = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const maxScroll = elementHeight - viewportHeight;
      if (maxScroll <= 0) return;
      
      const p = Math.max(0, Math.min(1, scrolled / maxScroll));
      progressVal.set(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [progressVal]);

  return (
    <section id="features" className="bg-[#050505] border-y border-gray-900 relative">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 relative z-10">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-amber-500 font-bold flex items-center gap-2">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-amber-500" />
            L'Écosystème
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 max-w-3xl text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-bold text-white">
            Chaque couche de la blockchain, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">maîtrisée.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative z-10" style={{ height: `${features.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
            <div className="relative h-[520px] sm:h-[480px] lg:h-[500px]">
              {features.map((f, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  total={features.length}
                  progress={progressVal}
                  feature={f}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  index,
  total,
  progress,
  feature,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  feature: (typeof features)[number];
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;

  const y = useTransform(progress, [start, end], [0, -40], { clamp: true });
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - 0.05, end]
      : index === total - 1
      ? [Math.max(0, start - 0.02), start, end]
      : [Math.max(0, start - 0.02), start, end - 0.05, end],
    index === 0
      ? [1, 1, 0]
      : index === total - 1
      ? [0, 1, 1]
      : [0, 1, 1, 0],
    { clamp: true }
  );
  const scale = useTransform(progress, [start, end], [1, 0.95], { clamp: true });

  const colors = [
    "from-amber-500/20 to-orange-600/5 border-amber-500/30",
    "from-blue-500/20 to-cyan-500/5 border-blue-500/30",
    "from-purple-500/20 to-pink-500/5 border-purple-500/30",
    "from-green-500/20 to-emerald-500/5 border-green-500/30"
  ];
  
  const shadowColors = [
    "rgba(251,191,36,0.15)",
    "rgba(59,130,246,0.15)",
    "rgba(168,85,247,0.15)",
    "rgba(34,197,94,0.15)"
  ];

  return (
    <motion.article
      style={{ y, opacity, scale, zIndex: total - index, boxShadow: `0 20px 80px -20px ${shadowColors[index]}` }}
      className={`absolute inset-0 rounded-2xl border bg-black/80 backdrop-blur-xl p-6 sm:p-8 lg:p-14 grid lg:grid-cols-2 gap-6 lg:gap-16 overflow-hidden bg-gradient-to-br ${colors[index]}`}
    >
      <div className="flex flex-col justify-between min-w-0 z-10 relative">
        <div>
          <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-gray-400 font-bold">
            {feature.tag}
          </div>
          <h3 className="mt-4 sm:mt-5 text-[26px] sm:text-[32px] lg:text-[44px] leading-[1.05] tracking-[-0.03em] font-bold max-w-md text-white">
            {feature.title}
          </h3>
          <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed text-gray-300 max-w-md">
            {feature.body}
          </p>
        </div>
        <ul className="mt-6 sm:mt-10 space-y-2.5 sm:space-y-3 text-[13px] sm:text-[14px]">
          {feature.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-gray-300 font-medium">
              <span className={`h-px w-5 ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-purple-500' : 'bg-green-500'}`} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative hidden lg:block rounded-xl border border-gray-800 bg-black/50 overflow-hidden shadow-inner">
        <FeatureVisual index={index} />
      </div>
    </motion.article>
  );
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="absolute inset-0 p-8">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          <span>Order Book Live</span>
          <span className="text-amber-500 flex items-center gap-2"><span className="live-dot h-1.5 w-1.5 bg-amber-500 rounded-full"></span> BTC / USDT</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6 text-[12px] tabular-nums font-mono">
          <div className="space-y-1.5">
            {[
              ["64,201.50", "0.42"],
              ["64,201.20", "1.18"],
              ["64,200.80", "0.67"],
              ["64,200.10", "2.41"],
              ["64,199.90", "0.92"],
            ].map(([p, q], i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex justify-between rounded-sm px-2 py-1"
              >
                <motion.span 
                  className="absolute inset-y-0 left-0 bg-green-500/10 border-l-2 border-green-500" 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${30 + i * 10}%` }}
                  transition={{ duration: 1 }}
                />
                <span className="relative text-green-400 font-bold">{p}</span>
                <span className="relative text-gray-400">{q}</span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[
              ["64,202.10", "0.31"],
              ["64,202.40", "0.89"],
              ["64,202.90", "1.55"],
              ["64,203.20", "0.74"],
              ["64,203.80", "2.02"],
            ].map(([p, q], i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex justify-between rounded-sm px-2 py-1"
              >
                <motion.span 
                  className="absolute inset-y-0 right-0 bg-red-500/10 border-r-2 border-red-500" 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${30 + i * 10}%` }}
                  transition={{ duration: 1 }}
                />
                <span className="relative text-red-400 font-bold">{p}</span>
                <span className="relative text-gray-400">{q}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="absolute inset-0 p-8">
        <div className="text-[11px] uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
          <span className="live-dot h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
          Live P&L · 30D
        </div>
        <svg viewBox="0 0 400 220" className="mt-4 h-[80%] w-full">
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" x2="400" y1={40 * i + 10} y2={40 * i + 10} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          ))}
          <motion.path
            d="M0,160 C40,150 70,130 110,120 C150,110 180,140 220,100 C260,60 290,80 330,50 C370,30 390,40 400,30"
            fill="none"
            stroke="#3b82f6"
            strokeOpacity={1}
            strokeWidth="3"
            filter="url(#glow-blue)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 240 240" className="h-64 w-64 text-purple-500">
          <defs>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {[1, 2, 3].map((r, i) => (
            <motion.circle
              key={r}
              cx="120"
              cy="120"
              r={50 + r * 28}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.4 - i * 0.1}
              strokeDasharray="4 8"
              initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "120px 120px" }}
            />
          ))}
          <motion.path
            d="M120 80 L150 92 V120 C150 142 135 156 120 162 C105 156 90 142 90 120 V92 Z"
            fill="rgba(168,85,247,0.1)"
            stroke="currentColor"
            strokeOpacity={1}
            strokeWidth="2"
            filter="url(#glow-purple)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6 }}
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 p-8 font-mono text-[13px] leading-7 text-green-400 bg-gray-900/50">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 font-sans mb-4 flex items-center gap-2">
        <span className="live-dot h-2 w-2 rounded-full bg-green-500" />
        Smart Contract Log
      </div>
      <motion.pre 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="whitespace-pre-wrap text-glow-green"
      >
{`rule "rebalance" {
  when  <span className="text-pink-400">drift &gt; 2%</span>
  then  <span className="text-blue-400">rebalance</span>(target)
        <span className="text-blue-400">notify</span>(team)
}

rule "yield" {
  when  <span className="text-pink-400">balance &gt; 250_000</span>
  then  <span className="text-blue-400">allocate</span>(usdc, 65%)
        <span className="text-blue-400">stake</span>(eth, 35%)
}`}
      </motion.pre>
    </div>
  );
}