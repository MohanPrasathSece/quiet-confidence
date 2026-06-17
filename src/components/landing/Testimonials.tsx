import { motion } from "motion/react";
import { Reveal } from "./primitives";

const items = [
  { quote: "Secrètement l'outil le plus réfléchi que nous ayons ajouté au bureau depuis des années.", name: "Helena Park", role: "Chef de la trésorerie, Northwind Capital" },
  { quote: "Un règlement qui fonctionne tout simplement. Nous avons arrêté de penser à l'infrastructure.", name: "Marco Bianchi", role: "CTO, Atlas Markets" },
  { quote: "On a l'impression d'un logiciel créé par des gens qui se soucient des logiciels.", name: "Aisha Rahman", role: "PM, Cedar Digital" },
  { quote: "La surface de risque à elle seule a remplacé trois fournisseurs. Tout le reste est un bonus.", name: "Daniel Voss", role: "Directeur des risques, Lumen" },
  { quote: "Des outils calmes pour un marché bruyant. Exactement ce que nous voulions.", name: "Sofia Lindgren", role: "Fondateur, Norden Labs" },
  { quote: "Prêt pour l'audit par défaut. Notre équipe de conformité est exceptionnellement heureuse.", name: "Jonas Weber", role: "Conformité, Pier 27" },
];

export function Testimonials() {
  const loop = [...items, ...items];
  return (
    <section id="customers" className="overflow-hidden border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            Par ceux qui l'utilisent
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