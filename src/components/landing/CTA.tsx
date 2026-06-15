import { Reveal } from "./primitives";

export function CTA() {
  return (
    <section id="cta" className="border-y border-border bg-card/40 py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            Get started
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[34px] lg:text-[56px] leading-[1.05] tracking-[-0.03em] font-medium">
            Ready to build with confidence?
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
            Talk to our team, or start exploring in a sandbox today.
            Either way, no noise.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background hover:opacity-90 transition-opacity"
            >
              Get started
              <span className="ml-2 opacity-70">→</span>
            </a>
            <a
              href="#"
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              Talk to us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}