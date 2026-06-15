import { motion } from "motion/react";
import { Reveal } from "./primitives";

const nodes = [
  { id: "wallet", label: "Wallet", x: 50, y: 50 },
  { id: "exchange", label: "Exchange", x: 18, y: 22 },
  { id: "analytics", label: "Analytics", x: 82, y: 22 },
  { id: "api", label: "API", x: 18, y: 78 },
  { id: "auto", label: "Automation", x: 82, y: 78 },
];

export function Ecosystem() {
  return (
    <section className="py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                Ecosystem
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium">
                A platform that <span className="text-muted-foreground">composes.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground max-w-sm">
                Every product is a primitive. Compose what you need. Replace
                what you don't. Nothing is locked in.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal y={24}>
              <div className="relative aspect-[5/4] rounded-2xl border border-border bg-card/40 overflow-hidden">
                <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
                  <defs>
                    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="oklch(0.92 0 0)" />
                    </pattern>
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
                        stroke="oklch(0.18 0 0)"
                        strokeOpacity="0.35"
                        strokeWidth="1"
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
                        r="2.5"
                        fill="oklch(0.18 0 0)"
                        initial={{ opacity: 0 }}
                        whileInView={{
                          opacity: [0, 1, 1, 0],
                          cx: [cx1, cx2],
                          cy: [cy1, cy2],
                        }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{
                          duration: 3.4,
                          delay: 1.6 + i * 0.4,
                          repeat: Infinity,
                          repeatDelay: 2.6,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </svg>

                {nodes.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-medium shadow-sm ${
                        n.id === "wallet" ? "bg-foreground text-background border-foreground" : ""
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