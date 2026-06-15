import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Mode = "signin" | "signup";

export function AuthModal({
  open,
  initialMode = "signin",
  onClose,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mode === "signin" ? "Sign in to Coffre" : "Create your Coffre account"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-[0_30px_80px_-20px_rgba(17,17,17,0.25)]"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-tight">
                <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-border bg-foreground text-background text-[11px] font-semibold">
                  C
                </span>
                Coffre
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-6 pt-8">
              <h2 className="text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.02em] font-medium">
                {mode === "signin" ? "Welcome back." : "Create your account."}
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to your Coffre workspace."
                  : "Start with a sandbox. No card required."}
              </p>
            </div>

            <form
              className="px-6 pt-7 pb-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Backend wiring pending.
              }}
            >
              {mode === "signup" && (
                <Field label="Full name" id="name" type="text" autoComplete="name" placeholder="Jean Dupont" />
              )}
              <Field label="Email" id="email" type="email" autoComplete="email" placeholder="you@company.com" />
              <Field
                label="Password"
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
              />

              {mode === "signin" && (
                <div className="flex justify-end">
                  <button type="button" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background hover:opacity-90 transition-opacity"
              >
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>

              <div className="relative my-2 flex items-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="flex-1 h-px bg-border" />
                <span className="px-3">or</span>
                <span className="flex-1 h-px bg-border" />
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-[14px] font-medium text-foreground hover:bg-accent transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.12A6.99 6.99 0 0 1 5.46 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.96l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="border-t border-border bg-card/40 px-6 py-4 text-center text-[13px] text-muted-foreground rounded-b-2xl">
              {mode === "signin" ? (
                <>
                  New to Coffre?{" "}
                  <button onClick={() => setMode("signup")} className="text-foreground hover:underline">
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setMode("signin")} className="text-foreground hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all"
      />
    </div>
  );
}