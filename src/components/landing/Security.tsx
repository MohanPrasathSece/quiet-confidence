import { motion } from "motion/react";
import { Reveal, SplitLines } from "./primitives";

export function Security() {
  return (
    <section id="security" className="py-24 sm:py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
        <div>
          <Reveal>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              Security
            </div>
          </Reveal>
          <h2 className="mt-5 text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium max-w-md">
            <SplitLines text="Built to be" />
            <br />
            <span className="text-muted-foreground">
              <SplitLines text="quietly unbreakable." delay={0.1} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-7 text-[17px] leading-relaxed text-muted-foreground max-w-md">
              MPC custody, hardware-backed signing, and policy-based approvals.
              Independently audited. Continuously monitored. Privately operated.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-10 grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden max-w-md">
              {[
                ["SOC 2 Type II", "Audited annually"],
                ["ISO 27001", "Certified"],
                ["MPC custody", "Threshold signing"],
                ["24/7 SOC", "Human + machine"],
              ].map(([t, s]) => (
                <div key={t} className="bg-background p-5">
                  <div className="text-[13px] font-medium">{t}</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{s}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative grid place-items-center min-h-[320px] sm:min-h-[420px]">
          <svg viewBox="0 0 400 400" className="h-[280px] w-[280px] sm:h-[380px] sm:w-[380px]">
            {[1, 2, 3, 4].map((i) => (
              <motion.circle
                key={i}
                cx="200"
                cy="200"
                r={50 + i * 38}
                fill="none"
                stroke="oklch(0.18 0 0)"
                strokeOpacity={0.18 - i * 0.03}
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "200px 200px" }}
              />
            ))}
            <motion.path
              d="M200 130 L246 148 V200 C246 240 224 264 200 274 C176 264 154 240 154 200 V148 Z"
              fill="oklch(1 0 0)"
              stroke="oklch(0.18 0 0)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M183 200 L196 213 L218 188"
              fill="none"
              stroke="oklch(0.18 0 0)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 1.6 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}