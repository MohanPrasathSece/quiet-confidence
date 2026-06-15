import { motion } from "motion/react";
import { Reveal } from "./primitives";

const items = [
  { quote: "Quietly the most considered tool we've added to the desk in years.", name: "Helena Park", role: "Head of Treasury, Northwind Capital" },
  { quote: "Settlement that just works. We stopped thinking about infrastructure.", name: "Marco Bianchi", role: "CTO, Atlas Markets" },
  { quote: "It feels like software made by people who care about software.", name: "Aisha Rahman", role: "PM, Cedar Digital" },
  { quote: "The risk surface alone replaced three vendors. Everything else is bonus.", name: "Daniel Voss", role: "Director of Risk, Lumen" },
  { quote: "Calm tooling for a noisy market. Exactly what we wanted.", name: "Sofia Lindgren", role: "Founder, Norden Labs" },
  { quote: "Audit-ready by default. Our compliance team is unusually happy.", name: "Jonas Weber", role: "Compliance, Pier 27" },
];

export function Testimonials() {
  const loop = [...items, ...items];
  return (
    <section id="customers" className="overflow-hidden border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            From the people who use it
          </div>
        </Reveal>
      </div>
      <div className="mt-12 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card/80 to-transparent z-10" />
        <motion.div
          className="flex gap-4 sm:gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((t, i) => (
            <figure
              key={i}
              className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl border border-border bg-background p-6 sm:p-7"
            >
              <blockquote className="text-[14px] sm:text-[16px] leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background text-[12px] font-medium">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="text-[12px]">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}