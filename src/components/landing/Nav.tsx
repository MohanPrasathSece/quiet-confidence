import { motion } from "motion/react";
import { Logo } from "@/components/Logo";

export function Nav({
  onSignIn,
  onSignUp,
}: {
  onSignIn: () => void;
  onSignUp: () => void;
}) {
  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Retour en haut"
          className="flex shrink-0 items-center gap-2 text-[15px] font-medium tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-md"
        >
          <Logo className="h-5 w-5 text-foreground" />
          <span>AtlasLedger</span>
        </button>
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-colors">Plateforme</a>
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#security" className="hover:text-foreground transition-colors">Sécurité</a>
          <a href="#customers" className="hover:text-foreground transition-colors">Clients</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onSignIn}
            className="hidden sm:inline-flex h-9 items-center px-3 text-[14px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex h-9 items-center rounded-full bg-foreground px-3.5 sm:px-4 text-[13px] font-medium text-background hover:opacity-90 transition-opacity"
          >
            Commencer
          </button>
        </div>
      </div>
    </motion.header>
  );
}