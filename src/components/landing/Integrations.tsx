import { motion } from "motion/react";
import { Reveal } from "./primitives";

const logos = [
  "Coinbase", "Fireblocks", "Anchorage", "Chainalysis", "Plaid",
  "Circle", "Kraken", "BitGo", "Stripe", "Modulr", "Bridge", "Ledger",
];

export function Integrations() {
  return (
    <section className="py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                Integrations
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium">
                Connected to where <span className="text-muted-foreground">money already lives.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <p className="text-[16px] leading-relaxed text-muted-foreground max-w-md">
                Over 60 custodians, exchanges, banks and analytics partners,
                connected through one set of APIs.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {logos.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background h-24 grid place-items-center text-[15px] tracking-tight text-muted-foreground hover:text-foreground transition-colors"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}