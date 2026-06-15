import { motion } from "motion/react";
import { Reveal, Parallax } from "./primitives";

export function ProductDemo() {
  return (
    <section className="border-y border-border bg-card/40 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              In motion
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium">
              A surface that responds <span className="text-muted-foreground">in real time.</span>
            </h2>
          </Reveal>
        </div>

        <Parallax intensity={24}>
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Reveal delay={0.05}>
              <Card title="Spot price" sub="BTC · USD">
                <div className="mt-4 text-[34px] tracking-tight tabular-nums">$64,201.50</div>
                <div className="mt-1 text-[12px] text-muted-foreground tabular-nums">+1.84% · 24h</div>
                <svg viewBox="0 0 240 60" className="mt-5 h-14 w-full">
                  <motion.path
                    d="M0,40 C30,30 50,50 80,32 C110,14 140,38 170,20 C200,4 220,18 240,10"
                    fill="none"
                    stroke="oklch(0.18 0 0)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6 }}
                  />
                </svg>
              </Card>
            </Reveal>
            <Reveal delay={0.15}>
              <Card title="Active orders" sub="Live · 23:14 UTC">
                <ul className="mt-4 space-y-3 text-[13px]">
                  {[
                    ["Limit buy", "BTC", "0.412"],
                    ["Limit sell", "ETH", "12.50"],
                    ["TWAP", "SOL", "1,200"],
                    ["Limit buy", "USDC", "50,000"],
                  ].map((r, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                      <div className="flex items-center gap-3">
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
                          className="h-1.5 w-1.5 rounded-full bg-foreground"
                        />
                        <span>{r[0]}</span>
                      </div>
                      <span className="text-muted-foreground tabular-nums">
                        {r[2]} {r[1]}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.25}>
              <Card title="Yield" sub="Allocation">
                <div className="mt-4 text-[34px] tracking-tight tabular-nums">4.82%</div>
                <div className="mt-1 text-[12px] text-muted-foreground">Target 4.50% – 5.25%</div>
                <div className="mt-5 space-y-3">
                  {[
                    ["T-Bills", 45],
                    ["USDC", 35],
                    ["Staking", 20],
                  ].map(([name, v], i) => (
                    <div key={String(name)}>
                      <div className="flex justify-between text-[12px]">
                        <span>{name}</span>
                        <span className="text-muted-foreground tabular-nums">{v}%</span>
                      </div>
                      <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-accent">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${v}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </Parallax>
      </div>
    </section>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-baseline justify-between">
        <div className="text-[13px] font-medium">{title}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{sub}</div>
      </div>
      {children}
    </div>
  );
}