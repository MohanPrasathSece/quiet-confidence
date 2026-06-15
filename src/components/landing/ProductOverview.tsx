import { Reveal, Parallax, SplitLines } from "./primitives";
import { DashboardMock } from "./DashboardMock";

export function ProductOverview() {
  return (
    <section id="platform" className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              The platform
            </div>
          </Reveal>
          <h2 className="mt-5 text-[28px] sm:text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium">
            <SplitLines text="One quiet surface" />
            <br />
            <span className="text-muted-foreground">
              <SplitLines text="for every asset." delay={0.1} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-7 text-[17px] leading-relaxed text-muted-foreground max-w-md">
              Custody, trading, analytics and reporting in a single, precise
              interface. Built for teams who measure quality in milliseconds —
              and decades.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <ul className="mt-10 space-y-4 text-[15px]">
              {[
                "Institutional-grade custody, by default.",
                "Real-time multi-venue execution.",
                "Programmable settlement and treasury.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 h-px w-5 bg-foreground" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Parallax intensity={20}>
            <Reveal y={24}>
              <div className="rounded-2xl border border-border bg-card p-2 shadow-[0_30px_80px_-30px_rgba(17,17,17,0.12)]">
                <DashboardMock />
              </div>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}