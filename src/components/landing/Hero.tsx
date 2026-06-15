import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitLines, Reveal } from "./primitives";
import { DashboardMock } from "./DashboardMock";

export function Hero({ onPrimary }: { onPrimary: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const dashScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36">
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal delay={0.05} y={8}>
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] sm:text-[12px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Coffre 2.0 — Now in general availability
          </div>
        </Reveal>

        <h1 className="mx-auto mt-7 sm:mt-8 max-w-5xl text-center text-[36px] sm:text-[58px] lg:text-[72px] leading-[1.12] sm:leading-[1.10] tracking-[-0.035em] font-medium text-balance">
          <span className="block">
            <SplitLines text="Crypto infrastructure" />
          </span>
          <span className="block text-muted-foreground">
            <SplitLines text="for the next generation." delay={0.15} />
          </span>
        </h1>

        <Reveal delay={0.5}>
          <p className="mx-auto mt-6 sm:mt-7 max-w-xl text-center text-[15px] sm:text-[17px] lg:text-[18px] leading-relaxed text-muted-foreground">
            Secure, scalable and intelligent tools built for modern finance.
            Engineered for institutions. Designed for everyone.
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPrimary}
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background hover:opacity-90 transition-opacity"
            >
              Get started
              <span className="ml-2 opacity-70">→</span>
            </button>
            <a
              href="#platform"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-[14px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              Explore platform
            </a>
          </div>
        </Reveal>

        <motion.div
          style={{ y: dashY, scale: dashScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 sm:mt-20 max-w-6xl"
        >
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-1.5 sm:p-2 shadow-[0_30px_80px_-30px_rgba(17,17,17,0.15)]">
            <DashboardMock />
          </div>

          {/* Floating indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
            className="absolute -left-4 top-16 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-border bg-background px-3 py-2 shadow-sm"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</div>
              <div className="text-[13px] font-medium tabular-nums">12ms</div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
            className="absolute -right-4 bottom-20 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-border bg-background px-3 py-2 shadow-sm"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Settlement</div>
              <div className="text-[13px] font-medium tabular-nums">0.4s</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}