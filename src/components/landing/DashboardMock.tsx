import { motion } from "motion/react";

export function DashboardMock() {
  const bars = [42, 58, 36, 64, 48, 72, 56, 80, 66, 88, 74, 92];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          </div>
          <div className="ml-4 text-[11px] text-muted-foreground tracking-wide">vault.app / portfolio</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          Live · 23:14:08 UTC
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