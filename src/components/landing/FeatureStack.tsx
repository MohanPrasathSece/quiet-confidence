import { motion, useMotionValue, useTransform, MotionValue } from "motion/react";
import { useRef, useEffect } from "react";
import { Reveal } from "./primitives";

const features = [
  {
    tag: "01 - Trading",
    title: "Execution that disappears.",
    body:
      "Smart routing across global venues with deterministic latency. No spread games. No surprises.",
    bullets: ["Multi-venue order book", "Deterministic 12ms routing", "Algorithmic execution"],
  },
  {
    tag: "02 - Analytics",
    title: "Numbers that hold up.",
    body:
      "Real-time portfolio, risk and attribution analytics. Auditable, reproducible, and yours.",
    bullets: ["Streaming P&L", "Factor attribution", "Custom reporting"],
  },
  {
    tag: "03 - Security",
    title: "Engineered to be boring.",
    body:
      "MPC custody, hardware-backed signing, and quorum policies designed by people who used to break them.",
    bullets: ["MPC custody", "Quorum policies", "SOC 2 Type II"],
  },
  {
    tag: "04 - Automation",
    title: "Treasury that runs itself.",
    body:
      "Programmable rules for rebalancing, yield, and settlement. Express intent. We handle the rest.",
    bullets: ["Policy engine", "Webhooks & SDKs", "Scheduled flows"],
  },
];

export function FeatureStack() {
  const ref = useRef<HTMLDivElement>(null);
  const progressVal = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const maxScroll = elementHeight - viewportHeight;
      if (maxScroll <= 0) return;
      
      const p = Math.max(0, Math.min(1, scrolled / maxScroll));
      progressVal.set(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [progressVal]);

  return (
    <section id="features" className="bg-card/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-24">
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            Four primitives
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 max-w-3xl text-[34px] lg:text-[48px] leading-[1.05] tracking-[-0.03em] font-medium">
            Every layer of the stack, considered.
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative" style={{ height: `${features.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
            <div className="relative h-[520px] sm:h-[480px] lg:h-[500px]">
              {features.map((f, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  total={features.length}
                  progress={progressVal}
                  feature={f}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  index,
  total,
  progress,
  feature,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  feature: (typeof features)[number];
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;

  // While the current segment is active, card is in place.
  // After its segment ends, card slides up & fades to reveal the next.
  const y = useTransform(progress, [start, end], [0, -40], { clamp: true });
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - 0.05, end]
      : index === total - 1
      ? [Math.max(0, start - 0.02), start, end]
      : [Math.max(0, start - 0.02), start, end - 0.05, end],
    index === 0
      ? [1, 1, 0]
      : index === total - 1
      ? [0, 1, 1]
      : [0, 1, 1, 0],
    { clamp: true }
  );
  const scale = useTransform(progress, [start, end], [1, 0.97], { clamp: true });

  return (
    <motion.article
      style={{ y, opacity, scale, zIndex: total - index }}
      className="absolute inset-0 rounded-2xl border border-border bg-background p-6 sm:p-8 lg:p-14 shadow-[0_30px_80px_-30px_rgba(17,17,17,0.12)] grid lg:grid-cols-2 gap-6 lg:gap-16 overflow-hidden"
    >
      <div className="flex flex-col justify-between min-w-0">
        <div>
          <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            {feature.tag}
          </div>
          <h3 className="mt-4 sm:mt-5 text-[26px] sm:text-[32px] lg:text-[44px] leading-[1.05] tracking-[-0.03em] font-medium max-w-md">
            {feature.title}
          </h3>
          <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed text-muted-foreground max-w-md">
            {feature.body}
          </p>
        </div>
        <ul className="mt-6 sm:mt-10 space-y-2.5 sm:space-y-3 text-[13px] sm:text-[14px]">
          {feature.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-5 bg-foreground" />
              <span className="text-foreground">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative hidden lg:block rounded-xl border border-border bg-card/60 overflow-hidden">
        <FeatureVisual index={index} />
      </div>
    </motion.article>
  );
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="absolute inset-0 p-8">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>Order Book</span>
          <span>BTC / USD</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6 text-[12px] tabular-nums">
          <div className="space-y-1.5">
            {[
              ["64,201.50", "0.42"],
              ["64,201.20", "1.18"],
              ["64,200.80", "0.67"],
              ["64,200.10", "2.41"],
              ["64,199.90", "0.92"],
            ].map(([p, q], i) => (
              <div key={i} className="relative flex justify-between rounded-sm px-2 py-1">
                <span className="absolute inset-y-0 left-0 bg-foreground/[0.05]" style={{ width: `${30 + i * 10}%` }} />
                <span className="relative text-foreground">{p}</span>
                <span className="relative text-muted-foreground">{q}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[
              ["64,202.10", "0.31"],
              ["64,202.40", "0.89"],
              ["64,202.90", "1.55"],
              ["64,203.20", "0.74"],
              ["64,203.80", "2.02"],
            ].map(([p, q], i) => (
              <div key={i} className="relative flex justify-between rounded-sm px-2 py-1">
                <span className="absolute inset-y-0 right-0 bg-foreground/[0.05]" style={{ width: `${30 + i * 10}%` }} />
                <span className="relative text-foreground">{p}</span>
                <span className="relative text-muted-foreground">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="absolute inset-0 p-8">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">P&L · 30D</div>
        <svg viewBox="0 0 400 220" className="mt-4 h-[80%] w-full">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" x2="400" y1={40 * i + 10} y2={40 * i + 10} stroke="oklch(0.94 0 0)" />
          ))}
          <motion.path
            d="M0,160 C40,150 70,130 110,120 C150,110 180,140 220,100 C260,60 290,80 330,50 C370,30 390,40 400,30"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.8}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8 }}
          />
        </svg>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 240 240" className="h-64 w-64 text-foreground">
          {[1, 2, 3].map((r, i) => (
            <motion.circle
              key={r}
              cx="120"
              cy="120"
              r={50 + r * 28}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.25 - i * 0.06}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: i * 0.15 }}
              style={{ transformOrigin: "120px 120px" }}
            />
          ))}
          <motion.path
            d="M120 80 L150 92 V120 C150 142 135 156 120 162 C105 156 90 142 90 120 V92 Z"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.8}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6 }}
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 p-8 font-mono text-[12px] leading-6 text-muted-foreground">
      <div className="text-[11px] uppercase tracking-wider">Policy</div>
      <pre className="mt-4 whitespace-pre-wrap">
{`rule "rebalance" {
  when  drift > 2%
  then  rebalance(target)
        notify(team)
}

rule "yield" {
  when  cash > 250_000
  then  allocate(usdc, 65%)
        allocate(t-bills, 35%)
}`}
      </pre>
    </div>
  );
}