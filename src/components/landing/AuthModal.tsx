import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { apiSignin, apiSignup } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

// ─── Constants ─────────────────────────────────────────────────────

type Mode = "signin" | "signup";

const INVESTMENT_OPTIONS = [
  { value: "", label: "Select investment amount…" },
  { value: "under_1000", label: "Under $1,000" },
  { value: "1000", label: "$1,000 – $4,999" },
  { value: "5000", label: "$5,000 – $9,999" },
  { value: "10000", label: "$10,000 – $24,999" },
  { value: "25000", label: "$25,000 – $49,999" },
  { value: "50000", label: "$50,000 – $99,999" },
  { value: "100000", label: "$100,000+" },
];

const COUNTRY_OPTIONS = [
  { value: "cy", label: "Cyprus" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "ae", label: "UAE" },
  { value: "sg", label: "Singapore" },
  { value: "au", label: "Australia" },
  { value: "other", label: "Other" },
];

// ─── Form types ────────────────────────────────────────────────────

interface SignupForm {
  name: string;
  email: string;
  phone: string;
}

interface SigninForm {
  email: string;
}

const EMPTY_SIGNUP: SignupForm = {
  name: "", email: "", phone: "",
};

const EMPTY_SIGNIN: SigninForm = { email: "" };

// ─── Component ─────────────────────────────────────────────────────

export function AuthModal({
  open,
  initialMode = "signin",
  onClose,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [signup, setSignup] = useState<SignupForm>(EMPTY_SIGNUP);
  const [signin, setSignin] = useState<SigninForm>(EMPTY_SIGNIN);
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [signinErrors, setSigninErrors] = useState<Partial<Record<keyof SigninForm, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSignup(EMPTY_SIGNUP);
      setSignin(EMPTY_SIGNIN);
      setSignupErrors({});
      setSigninErrors({});
      setSubmitStatus("idle");
      setApiError("");
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // ── Field helpers ─────────────────────────────────────────────────

  const setSignupField = (f: keyof SignupForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setSignup((s) => ({ ...s, [f]: e.target.value }));

  const setSigninField = (f: keyof SigninForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setSignin((s) => ({ ...s, [f]: e.target.value }));

  // ── Validation ────────────────────────────────────────────────────

  const validateSignup = (): boolean => {
    const e: Partial<Record<keyof SignupForm, string>> = {};
    if (!signup.name.trim()) e.name = "Requis";
    if (!signup.email.trim() || !/\S+@\S+\.\S+/.test(signup.email)) e.email = "E-mail valide requis";
    
    const cleanNum = signup.phone.replace(/\s+/g, "");
    if (!cleanNum) {
      e.phone = "Veuillez entrer un numéro de téléphone";
    } else if (!/^(\+41|0041|0)?[1-9]\d{8}$/.test(cleanNum)) {
      e.phone = "Veuillez entrer un numéro suisse valide (ex: 079 123 45 67)";
    }
    
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignin = (): boolean => {
    const e: Partial<Record<keyof SigninForm, string>> = {};
    if (!signin.email.trim() || !/\S+@\S+\.\S+/.test(signin.email)) e.email = "E-mail valide requis";
    setSigninErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit handlers ───────────────────────────────────────────────

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setSubmitStatus("loading");
    setApiError("");
    try {
      const { token, user } = await apiSignup(signup);
      login(token, user);
      setSubmitStatus("success");
      setTimeout(() => { onClose(); navigate("/dashboard"); }, 800);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Échec de l'inscription. Veuillez réessayer.");
      setSubmitStatus("idle");
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignin()) return;
    setSubmitStatus("loading");
    setApiError("");
    try {
      const { token, user } = await apiSignin(signin.email);
      login(token, user);
      setSubmitStatus("success");
      setTimeout(() => { onClose(); navigate("/dashboard"); }, 600);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Échec de la connexion. Veuillez réessayer.");
      setSubmitStatus("idle");
    }
  };

  // ── Style helpers ─────────────────────────────────────────────────

  const ic = (hasError: boolean) =>
    `mt-2 h-11 w-full rounded-lg border ${hasError ? "border-red-400" : "border-border"} bg-background px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all`;

  // ── Render ────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <button type="button" aria-label="Close" onClick={onClose}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-md" />

          {/* Dialog */}
          <motion.div
            role="dialog" aria-modal="true"
            aria-label={mode === "signin" ? "Connectez-vous à AtlasLedger" : "Créez votre compte AtlasLedger"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-8 w-full max-w-md rounded-2xl border border-border bg-background shadow-[0_30px_80px_-20px_rgba(17,17,17,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-2 text-[15px] font-medium tracking-tight">
                <Logo className="h-5 w-5 text-foreground" />
                AtlasLedger
              </div>
              <button onClick={onClose} aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Title */}
            <div className="px-6 pt-6">
              <h2 className="text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.02em] font-medium">
                {mode === "signin" ? "Bon retour." : "Créez votre compte."}
              </h2>
              <p className="mt-2 text-[15px] text-muted-foreground">
                {mode === "signin"
                  ? "Connectez-vous à votre espace de travail AtlasLedger."
                  : "Rejoignez des milliers d'investisseurs qui développent leur portefeuille crypto."}
              </p>
            </div>

            {/* Success flash */}
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }} className="px-6 py-10 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-medium">{mode === "signin" ? "Connecté !" : "Compte créé !"}</h3>
                  <p className="mt-1 text-[15px] text-muted-foreground">Redirection vers votre tableau de bord…</p>
                </motion.div>
              ) : mode === "signin" ? (
                /* ── Sign-in ── */
                <motion.form key="signin" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}
                  className="px-6 pt-7 pb-6 space-y-4" onSubmit={handleSignin}>

                  <div>
                    <label className="block text-[15px] font-medium text-foreground">E-mail</label>
                    <input type="email" placeholder="you@company.com" autoComplete="email"
                      value={signin.email} onChange={setSigninField("email")} className={ic(!!signinErrors.email)} />
                    {signinErrors.email && <p className="mt-1 text-[15px] text-red-500">{signinErrors.email}</p>}
                  </div>

                  {apiError && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[15px] text-red-600">{apiError}</div>}

                  <button type="submit" disabled={submitStatus === "loading"}
                    className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[15px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitStatus === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours…</> : "Se connecter"}
                  </button>
                </motion.form>
              ) : (
                /* ── Sign-up ── */
                <motion.form key="signup" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}
                  onSubmit={handleSignup} className="px-6 pt-6 pb-6 space-y-3.5">

                  {/* Name */}
                  <div>
                    <label className="block text-[15px] font-medium text-foreground">Nom *</label>
                    <input type="text" placeholder="John Doe" value={signup.name} onChange={setSignupField("name")} className={ic(!!signupErrors.name)} />
                    {signupErrors.name && <p className="mt-1 text-[15px] text-red-500">{signupErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[15px] font-medium text-foreground">E-mail *</label>
                    <input type="email" placeholder="you@company.com" autoComplete="email" value={signup.email} onChange={setSignupField("email")} className={ic(!!signupErrors.email)} />
                    {signupErrors.email && <p className="mt-1 text-[15px] text-red-500">{signupErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[15px] font-medium text-foreground">Numéro de téléphone *</label>
                    <input type="tel" placeholder="+357 99 261 501" autoComplete="tel" value={signup.phone} onChange={setSignupField("phone")} className={ic(!!signupErrors.phone)} />
                    {signupErrors.phone && <p className="mt-1 text-[15px] text-red-500">{signupErrors.phone}</p>}
                  </div>

                  {apiError && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[15px] text-red-600">{apiError}</div>}

                  <button type="submit" disabled={submitStatus === "loading"}
                    className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[15px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitStatus === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Création du compte…</> : "Créer un compte"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer toggle */}
            {submitStatus !== "success" && (
              <div className="border-t border-border bg-card/40 px-6 py-4 text-center text-[15px] text-muted-foreground rounded-b-2xl">
                {mode === "signin" ? (
                  <>Nouveau sur AtlasLedger ?{" "}<button onClick={() => { setMode("signup"); setApiError(""); setSignupErrors({}); setSigninErrors({}); }} className="text-foreground hover:underline">Créer un compte</button></>
                ) : (
                  <>Vous avez déjà un compte ?{" "}<button onClick={() => { setMode("signin"); setApiError(""); setSignupErrors({}); setSigninErrors({}); }} className="text-foreground hover:underline">Se connecter</button></>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
