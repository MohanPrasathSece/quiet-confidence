import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Bitcoin, Gem, Hexagon, Zap } from "lucide-react";
import { SplitLines, Reveal } from "./primitives";
import { DashboardMock } from "./DashboardMock";

export function Hero({ onPrimary }: { onPrimary: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const dashScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36 bg-[#050505]">
      {/* Dynamic Animated Background Grid */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 bg-crypto-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        aria-hidden
      />
      
      {/* Floating Crypto Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute left-[10%] top-[20%] text-amber-500/30"
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bitcoin size={64} />
        </motion.div>
        <motion.div 
          className="absolute right-[15%] top-[15%] text-purple-500/30"
          animate={{ y: [0, 40, 0], rotate: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gem size={56} />
        </motion.div>
        <motion.div 
          className="absolute left-[20%] bottom-[30%] text-blue-500/20"
          animate={{ y: [0, 20, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Hexagon size={80} />
        </motion.div>
        <motion.div 
          className="absolute right-[25%] bottom-[20%] text-green-500/30"
          animate={{ y: [0, -25, 0], rotate: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap size={48} />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 z-10">
        <Reveal delay={0.05} y={15}>
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-black/60 px-4 py-1.5 text-[12px] sm:text-[13px] text-amber-500 neon-border-amber backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-500 live-dot" />
            AtlasLedger 2.0 - Le Futur est en ligne
          </div>
        </Reveal>

        <h1 className="mx-auto mt-8 sm:mt-10 max-w-5xl text-center text-[40px] sm:text-[64px] lg:text-[80px] leading-[1.1] font-bold text-balance text-white">
          <span className="block text-glow-amber">
            <SplitLines text="Infrastructure crypto" />
          </span>
          <span className="block overflow-hidden pb-4 mt-[-10px]">
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              pour la prochaine génération.
            </motion.span>
          </span>
        </h1>

        <Reveal delay={0.5}>
          <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-center text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed text-gray-400">
            Des outils sécurisés, évolutifs et intelligents conçus pour la finance décentralisée.
            Conçu pour les institutions. Pensé pour le Web3.
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <button
              type="button"
              onClick={onPrimary}
              className="group relative inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 text-[15px] font-bold text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105"
            >
              Commencer
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <a
              href="#platform"
              className="inline-flex h-14 items-center justify-center rounded-full border border-blue-500/50 bg-black/50 px-8 text-[15px] font-medium text-white hover:bg-blue-500/10 transition-colors backdrop-blur-sm neon-border-blue"
            >
              Explorer l'écosystème
            </a>
          </div>
        </Reveal>

        <motion.div
          style={{ y: dashY, scale: dashScale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 sm:mt-24 max-w-6xl"
        >
          {/* Neon Glow behind Dashboard */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 opacity-30 blur-2xl animate-pulse" />
          
          <div className="relative rounded-xl sm:rounded-2xl bg-[#0a0a0c] border border-gray-800 p-1.5 sm:p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <DashboardMock />
          </div>

          {/* Floating indicators */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
            className="absolute -left-6 top-20 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-amber-500/30 bg-black/80 px-4 py-3 shadow-[0_0_15px_rgba(251,191,36,0.15)] backdrop-blur-md"
            >
              <div className="text-[11px] uppercase tracking-wider text-amber-500 font-semibold mb-1">Hash Rate</div>
              <div className="text-[15px] font-bold tabular-nums text-white flex items-center gap-2">
                <span className="live-dot h-2 w-2 rounded-full bg-amber-500 inline-block" />
                124.5 TH/s
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
            className="absolute -right-6 bottom-24 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-blue-500/30 bg-black/80 px-4 py-3 shadow-[0_0_15px_rgba(56,189,248,0.15)] backdrop-blur-md"
            >
              <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold mb-1">Dernier Bloc</div>
              <div className="text-[15px] font-bold tabular-nums text-white">#845,921</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}