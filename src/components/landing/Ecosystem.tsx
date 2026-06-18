import { motion } from "motion/react";
import { Reveal } from "./primitives";

const nodes = [
  { id: "wallet", label: "Smart Wallet", x: 50, y: 50 },
  { id: "exchange", label: "DEX Aggregator", x: 18, y: 22 },
  { id: "analytics", label: "On-Chain Analytics", x: 82, y: 22 },
  { id: "api", label: "Web3 API", x: 18, y: 78 },
  { id: "auto", label: "Yield Optimizer", x: 82, y: 78 },
];

export function Ecosystem() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-black">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-12 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="text-[12px] uppercase tracking-[0.18em] text-blue-400 font-bold flex items-center gap-2">
                <span className="live-dot h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Architecture Web3
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-bold text-white">
                Un réseau qui <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">s'interconnecte.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-[16px] leading-relaxed text-gray-400 max-w-sm">
                Chaque module est un smart contract autonome. Composez votre propre écosystème DeFi. Intégrez, échangez, automatisez. Sans limite.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal y={24}>
              <div className="relative aspect-[5/4] rounded-2xl border border-gray-800 bg-black/50 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                {/* Abstract Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
                  <defs>
                    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
                    </pattern>
                    <filter id="glow-line">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="glow-dot">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <rect width="500" height="400" fill="url(#dots)" />

                  {nodes.slice(1).map((n, i) => {
                    const cx1 = (50 / 100) * 500;
                    const cy1 = (50 / 100) * 400;
                    const cx2 = (n.x / 100) * 500;
                    const cy2 = (n.y / 100) * 400;
                    return (
                      <motion.line
                        key={n.id}
                        x1={cx1}
                        y1={cy1}
                        x2={cx2}
                        y2={cy2}
                        stroke="#3b82f6"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        filter="url(#glow-line)"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      />
                    );
                  })}

                  {nodes.slice(1).map((n, i) => {
                    const cx1 = (50 / 100) * 500;
                    const cy1 = (50 / 100) * 400;
                    const cx2 = (n.x / 100) * 500;
                    const cy2 = (n.y / 100) * 400;
                    return (
                      <motion.circle
                        key={n.id + "-d"}
                        r="3"
                        fill="#60a5fa"
                        filter="url(#glow-dot)"
                        initial={{ opacity: 0 }}
                        whileInView={{
                          opacity: [0, 1, 1, 0],
                          cx: [cx1, cx2],
                          cy: [cy1, cy2],
                        }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{
                          duration: 2.5,
                          delay: 1.6 + i * 0.4,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </svg>

                {nodes.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`rounded-full border px-4 py-2 text-[12px] font-bold shadow-sm whitespace-nowrap backdrop-blur-md transition-transform hover:scale-110 cursor-pointer ${
                        n.id === "wallet" 
                          ? "bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)]" 
                          : "bg-black/80 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:border-blue-400 hover:text-white"
                      }`}
                    >
                      {n.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}