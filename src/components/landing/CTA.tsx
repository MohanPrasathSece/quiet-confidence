import { Reveal } from "./primitives";

export function CTA({ onPrimary }: { onPrimary: () => void }) {
  return (
    <section id="cta" className="border-y border-border bg-card/40 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <Reveal>
            Commencer
        </Reveal>
        <Reveal delay={0.1}>
            Prêt à construire en toute confiance ?
        </Reveal>
        <Reveal delay={0.25}>
            Parlez à notre équipe, ou commencez à explorer dans un environnement de test dès aujourd'hui. Dans tous les cas, pas de bruit.
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPrimary}
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background hover:opacity-90 transition-opacity"
            >
              Commencer
              <span className="ml-2 opacity-70">→</span>
            </button>
            <a
              href="#contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}