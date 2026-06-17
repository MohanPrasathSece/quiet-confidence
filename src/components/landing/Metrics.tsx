import { Counter, Reveal } from "./primitives";

const items = [
  { value: 12, suffix: "B", prefix: "$", label: "Volume traité", decimals: 0 },
  { value: 180, suffix: "", prefix: "", label: "Pays desservis" },
  { value: 1, suffix: "M+", prefix: "", label: "Utilisateurs actifs" },
  { value: 99.99, suffix: "%", prefix: "", label: "Garantie de disponibilité", decimals: 2 },
];

export function Metrics() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-20 sm:py-24">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            Une confiance à grande échelle
          </div>
        </Reveal>
        <div className="mt-12 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border overflow-hidden rounded-2xl">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.08} className="bg-background p-6 sm:p-8 lg:p-10">
              <div className="text-[30px] sm:text-[40px] lg:text-[56px] leading-none tracking-[-0.03em] font-medium tabular-nums">
                <Counter to={it.value} prefix={it.prefix} suffix={it.suffix} decimals={it.decimals ?? 0} />
              </div>
              <div className="mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-muted-foreground">{it.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}