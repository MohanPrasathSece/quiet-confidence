import { motion } from "motion/react";
import { Zap } from "lucide-react";

export function DashboardMock() {
  const bars = [42, 58, 36, 64, 48, 72, 56, 80, 66, 88, 74, 92];
  return (
    <div className="overflow-hidden rounded-xl bg-black/60 backdrop-blur-xl border border-gray-800">
      {/* Top bar (Macbook Tabs design) */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-black/80 px-4 pt-3 pb-0 select-none">
        {/* Left window control buttons */}
        <div className="flex items-center gap-1.5 pb-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/20" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/20" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/20" />
        </div>

        {/* Tabs */}
        <div className="flex items-end gap-1.5 px-4 overflow-x-auto scrollbar-none max-w-lg">
          {/* Active Tab */}
          <div className="flex items-center gap-2 rounded-t-lg bg-gray-900/80 border-t border-x border-amber-500/30 px-3.5 py-1.5 text-[11px] font-medium text-amber-500 relative z-10 -mb-[1px]">
            <span>atlas.app / dashboard</span>
          </div>

          {/* Inactive Tab */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-medium text-gray-500 hover:text-white transition-colors cursor-pointer">
            <span>yield_farming</span>
          </div>

          {/* Inactive Tab */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-medium text-gray-500 hover:text-white transition-colors cursor-pointer">
            <span>smart_contracts</span>
          </div>
        </div>

        {/* Right side status */}
        <div className="hidden sm:flex items-center gap-2 pb-3 text-[10px] text-green-500 font-semibold uppercase tracking-widest">
          <span className="live-dot h-2 w-2 rounded-full bg-green-500"></span>
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-900/50">
        {/* Main chart */}
        <div className="lg:col-span-2 bg-black/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Total Value Locked (TVL)</div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-[28px] font-bold tracking-tight tabular-nums text-white text-glow-amber">$12,484,902.41</span>
                <motion.span 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[12px] text-green-400 font-semibold tabular-nums text-glow-green flex items-center"
                >
                  <Zap size={12} className="mr-1" />
                  +14.2%
                </motion.span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-gray-800 p-0.5 text-[11px] bg-black">
              {["1H", "1D", "1W", "1M", "ALL"].map((p, i) => (
                <span
                  key={p}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${i === 2 ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]" : "text-gray-400 hover:text-white"}`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Line chart */}
          <div className="mt-6 h-40">
            <svg viewBox="0 0 600 160" className="h-full w-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(251, 191, 36, 0.3)" />
                  <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" x2="600" y1={40 * i + 10} y2={40 * i + 10} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
              ))}
              <motion.path
                d="M0,110 C60,90 100,120 160,80 C220,40 260,90 320,60 C380,30 420,70 480,40 C540,10 580,30 600,20"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,110 C60,90 100,120 160,80 C220,40 260,90 320,60 C380,30 420,70 480,40 C540,10 580,30 600,20 L600,160 L0,160 Z"
                fill="url(#chartGradient)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </svg>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-black/40 p-6">
          <div className="text-[11px] uppercase tracking-wider text-gray-400">Portfolio Allocation</div>
          <div className="mt-5 space-y-4">
            {[
              { name: "BTC", v: 45, amt: "$5,618,206", color: "bg-amber-500", glow: "shadow-[0_0_10px_rgba(251,191,36,0.5)]" },
              { name: "ETH", v: 30, amt: "$3,745,470", color: "bg-purple-500", glow: "shadow-[0_0_10px_rgba(168,85,247,0.5)]" },
              { name: "SOL", v: 15, amt: "$1,872,735", color: "bg-green-400", glow: "shadow-[0_0_10px_rgba(74,222,128,0.5)]" },
              { name: "USDC", v: 10, amt: "$1,248,490", color: "bg-blue-400", glow: "shadow-[0_0_10px_rgba(96,165,250,0.5)]" },
            ].map((row, i) => (
              <div key={row.name}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-bold text-white">{row.name}</span>
                  <span className="tabular-nums text-gray-400">{row.amt}</span>
                </div>
                <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.v}%` }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${row.color} ${row.glow}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bars */}
      <div className="grid grid-cols-12 items-end gap-1.5 border-t border-gray-800 bg-black p-4 h-28 relative overflow-hidden">
        {/* Animated background gradient for bottom bars */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: `${h}%`, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.05, ease: "easeOut" }}
            className={`rounded-t-sm w-full relative group ${i % 3 === 0 ? "bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.4)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"}`}
          >
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}