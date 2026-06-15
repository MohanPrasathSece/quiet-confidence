import { motion } from "motion/react";

export function DashboardMock() {
  const bars = [42, 58, 36, 64, 48, 72, 56, 80, 66, 88, 74, 92];
  return (
    <div className="overflow-hidden rounded-xl bg-background">
      {/* Top bar (Macbook Tabs design) */}
      <div className="flex items-center justify-between border-b border-border bg-accent/40 px-4 pt-3 pb-0 select-none">
        {/* Left window control buttons */}
        <div className="flex items-center gap-1.5 pb-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/20" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/20" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/20" />
        </div>

        {/* Tabs */}
        <div className="flex items-end gap-1.5 px-4 overflow-x-auto scrollbar-none max-w-lg">
          {/* Active Tab */}
          <div className="flex items-center gap-2 rounded-t-lg bg-background border-t border-x border-border px-3.5 py-1.5 text-[11px] font-medium text-foreground relative z-10 -mb-[1px]">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>vault.app / portfolio</span>
          </div>

          {/* Inactive Tab */}
          <div className="flex items-center gap-2 rounded-t-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer mb-[1px]">
            <span>yield_optimization</span>
          </div>

          {/* Inactive Tab */}
          <div className="flex items-center gap-2 rounded-t-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer mb-[1px]">
            <span>settlement_rules</span>
          </div>
        </div>

        {/* Right side status */}
        <div className="hidden sm:flex items-center gap-2 pb-3 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live · UTC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
        {/* Main chart */}
        <div className="lg:col-span-2 bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total assets</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[28px] font-medium tracking-tight tabular-nums">$1,284,902.41</span>
                <span className="text-[12px] text-muted-foreground tabular-nums">+2.41%</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-border p-0.5 text-[11px]">
              {["1D", "1W", "1M", "1Y", "ALL"].map((p, i) => (
                <span
                  key={p}
                  className={`px-2.5 py-1 rounded-full ${i === 2 ? "bg-foreground text-background" : "text-muted-foreground"}`}
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
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.18 0 0)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="oklch(0.18 0 0)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" x2="600" y1={40 * i + 10} y2={40 * i + 10} stroke="oklch(0.94 0 0)" strokeWidth="1" />
              ))}
              <motion.path
                d="M0,110 C60,90 100,120 160,80 C220,40 260,90 320,60 C380,30 420,70 480,40 C540,10 580,30 600,20"
                fill="none"
                stroke="oklch(0.18 0 0)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M0,110 C60,90 100,120 160,80 C220,40 260,90 320,60 C380,30 420,70 480,40 C540,10 580,30 600,20 L600,160 L0,160 Z"
                fill="url(#g1)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-background p-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Allocation</div>
          <div className="mt-5 space-y-4">
            {[
              { name: "BTC", v: 42, amt: "$540,612" },
              { name: "ETH", v: 28, amt: "$359,772" },
              { name: "SOL", v: 16, amt: "$205,584" },
              { name: "USDC", v: 14, amt: "$178,886" },
            ].map((row, i) => (
              <div key={row.name}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">{row.name}</span>
                  <span className="tabular-nums text-muted-foreground">{row.amt}</span>
                </div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-accent">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.v}%` }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bars */}
      <div className="grid grid-cols-12 items-end gap-1 border-t border-border bg-background p-4 h-24">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-sm bg-foreground/85"
          />
        ))}
      </div>
    </div>
  );
}