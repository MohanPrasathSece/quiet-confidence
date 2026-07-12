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

const COUNTRY_PHONE_PATTERNS: Record<string, { code: string; pattern: RegExp; example: string }> = {
  CH: { code: "+41", pattern: /^(\+41|0041|0)?[1-9]\d{8}$/, example: "079 123 45 67" },
  FR: { code: "+33", pattern: /^(\+33|0033|0)?[1-9]\d{8}$/, example: "06 12 34 56 78" },
  BE: { code: "+32", pattern: /^(\+32|0032|0)?[1-9]\d{8}$/, example: "0471 12 34 56" },
  CA: { code: "+1", pattern: /^(\+1|001)?[2-9]\d{9}$/, example: "416 555 0123" },
  US: { code: "+1", pattern: /^(\+1|001)?[2-9]\d{9}$/, example: "212 555 0123" },
  GB: { code: "+44", pattern: /^(\+44|0044|0)?[1-9]\d{9,10}$/, example: "07700 900123" },
  DE: { code: "+49", pattern: /^(\+49|0049|0)?[1-9]\d{8,11}$/, example: "0152 12345678" },
  ES: { code: "+34", pattern: /^(\+34|0034|0)?[6-9]\d{8}$/, example: "612 345 678" },
  IT: { code: "+39", pattern: /^(\+39|0039|0)?[3]\d{8,9}$/, example: "312 3456789" },
  NL: { code: "+31", pattern: /^(\+31|0031|0)?[6]\d{8}$/, example: "06 12345678" },
  SE: { code: "+46", pattern: /^(\+46|0046|0)?[7-9]\d{8}$/, example: "070 123 45 67" },
  AU: { code: "+61", pattern: /^(\+61|0061|0)?[4]\d{8}$/, example: "0412 345 678" },
  IN: { code: "+91", pattern: /^(\+91|0091|0)?[6-9]\d{9}$/, example: "98765 43210" },
  AE: { code: "+971", pattern: /^(\+971|00971)?[5]\d{8}$/, example: "50 123 4567" },
  SG: { code: "+65", pattern: /^(\+65|0065)?[8-9]\d{7}$/, example: "8123 4567" },
  ZA: { code: "+27", pattern: /^(\+27|0027|0)?[6-8]\d{8}$/, example: "082 123 4567" },
  BR: { code: "+55", pattern: /^(\+55|0055)?[1-9]\d{10}$/, example: "11 91234 5678" },
  MX: { code: "+52", pattern: /^(\+52|0052)?[1-9]\d{10}$/, example: "55 1234 5678" },
  JP: { code: "+81", pattern: /^(\+81|0081|0)?[7-9]\d{8,9}$/, example: "090 1234 5678" },
  CY: { code: "+357", pattern: /^(\+357|00357)?[2-9]\d{7}$/, example: "99 123456" },
};

// ─── Form types ────────────────────────────────────────────────────

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

interface SigninForm {
  email: string;
}

const EMPTY_SIGNUP: SignupForm = {
  name: "", email: "", phone: "", countryCode: "CH",
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

  const setSignupCountryCode = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSignup((s) => ({ ...s, countryCode: e.target.value }));

  const setSigninField = (f: keyof SigninForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setSignin((s) => ({ ...s, [f]: e.target.value }));

  // ── Validation ────────────────────────────────────────────────────

  const validateSignup = (): boolean => {
    const e: Partial<Record<keyof SignupForm, string>> = {};
    if (!signup.name.trim()) e.name = "Requis";
    if (!signup.email.trim() || !/\S+@\S+\.\S+/.test(signup.email)) e.email = "E-mail valide requis";
    
    const cleanNum = signup.phone.replace(/\s+/g, "");
    const countryPattern = COUNTRY_PHONE_PATTERNS[signup.countryCode];
    
    if (!cleanNum) {
      e.phone = "Veuillez entrer un numéro de téléphone";
    } else if (countryPattern && !countryPattern.pattern.test(cleanNum)) {
      e.phone = `Veuillez entrer un numéro valide pour ${signup.countryCode} (ex: ${countryPattern.example})`;
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
                    
<div style={{ display: 'flex', gap: '8px', width: '100%' }}>
    <select name="countryCode" value={signup.countryCode} onChange={setSignupCountryCode} style={{ width: '110px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '0.8rem', fontFamily: 'inherit', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '30px', cursor: 'pointer' }}>
        <option value="CH">🇨🇭 +41</option>
        <option value="FR">🇫🇷 +33</option>
        <option value="BE">🇧🇪 +32</option>
        <option value="CA">🇨🇦 +1</option>
        <option value="US">🇺🇸 +1</option>
        <option value="GB">🇬🇧 +44</option>
        <option value="DE">🇩🇪 +49</option>
        <option value="ES">🇪🇸 +34</option>
        <option value="IT">🇮🇹 +39</option>
        <option value="NL">🇳🇱 +31</option>
        <option value="SE">🇸🇪 +46</option>
        <option value="AU">🇦🇺 +61</option>
        <option value="IN">🇮🇳 +91</option>
        <option value="AE">🇦🇪 +971</option>
        <option value="SG">🇸🇬 +65</option>
        <option value="ZA">🇿🇦 +27</option>
        <option value="BR">🇧🇷 +55</option>
        <option value="MX">🇲🇽 +52</option>
        <option value="JP">🇯🇵 +81</option>
        <option value="CY">🇨🇾 +357</option>
    </select>
<input type="tel" placeholder="+357 99 261 501" autoComplete="tel" value={signup.phone} onChange={setSignupField("phone")} className={ic(!!signupErrors.phone)}  style={{ flex: 1 }} />
</div>
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
