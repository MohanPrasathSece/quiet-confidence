import { motion } from "motion/react";

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
          aria-label="Back to top"
          className="flex shrink-0 items-center gap-2 text-[15px] font-medium tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-md"
        >
          <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-border bg-foreground text-background text-[11px] font-semibold">
            C
          </span>
          <span>Coffre</span>
        </button>
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          <a href="#customers" className="hover:text-foreground transition-colors">Customers</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onSignIn}
            className="hidden sm:inline-flex h-9 items-center px-3 text-[14px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex h-9 items-center rounded-full bg-foreground px-3.5 sm:px-4 text-[13px] font-medium text-background hover:opacity-90 transition-opacity"
          >
            Get started
          </button>
        </div>
      </div>
    </motion.header>
  );
}