import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function FinalStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacityCtx = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  const text = "Build the future of finance.";
  const words = text.split(" ");

  return (
    <section ref={ref} className="py-32 sm:py-44 lg:py-56 bg-background">
      <motion.div style={{ opacity: opacityCtx }} className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <h2 className="text-center text-[36px] sm:text-[72px] lg:text-[112px] leading-[1.02] sm:leading-[1.0] tracking-[-0.04em] font-medium text-balance">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] last:mr-0">
              <motion.span
                className="inline-block"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === words.length - 1 ? <span className="text-muted-foreground">{w}</span> : w}
              </motion.span>
            </span>
          ))}
        </h2>
      </motion.div>
    </section>
  );
}