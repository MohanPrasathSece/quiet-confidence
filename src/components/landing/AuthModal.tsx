import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { apiSignin, apiSignup } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";

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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  howMuchInvested: string;
  password: string;
}

interface SigninForm {
  email: string;
  password: string;
}

const EMPTY_SIGNUP: SignupForm = {
  firstName: "", lastName: "", email: "", phone: "", country: "", howMuchInvested: "", password: "",
};

const EMPTY_SIGNIN: SigninForm = { email: "", password: "" };

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSignup(EMPTY_SIGNUP);
      setSignin(EMPTY_SIGNIN);
      setSignupErrors({});
      setSigninErrors({});
      setSubmitStatus("idle");
      setApiError("");
      setShowPassword(false);
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setSignup((s) => ({ ...s, [f]: e.target.value }));

  const setSigninField = (f: keyof SigninForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setSignin((s) => ({ ...s, [f]: e.target.value }));

  // ── Validation ────────────────────────────────────────────────────

  const validateSignup = (): boolean => {
    const e: Partial<Record<keyof SignupForm, string>> = {};
    if (!signup.firstName.trim()) e.firstName = "Required";
    if (!signup.lastName.trim()) e.lastName = "Required";
    if (!signup.email.trim() || !/\S+@\S+\.\S+/.test(signup.email)) e.email = "Valid email required";
    if (!signup.phone.trim()) e.phone = "Required";
    if (!signup.country) e.country = "Required";
    if (!signup.howMuchInvested) e.howMuchInvested = "Required";
    if (!signup.password || signup.password.length < 6) e.password = "Min 6 characters";
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignin = (): boolean => {
    const e: Partial<Record<keyof SigninForm, string>> = {};
    if (!signin.email.trim() || !/\S+@\S+\.\S+/.test(signin.email)) e.email = "Valid email required";
    if (!signin.password) e.password = "Required";
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
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setSubmitStatus("idle");
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignin()) return;
    setSubmitStatus("loading");
    setApiError("");
    try {
      const { token, user } = await apiSignin(signin.email, signin.password);
      login(token, user);
      setSubmitStatus("success");
      setTimeout(() => { onClose(); navigate("/dashboard"); }, 600);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
      setSubmitStatus("idle");
    }
  };

  // ── Style helpers ─────────────────────────────────────────────────

  const ic = (hasError: boolean) =>
    `mt-2 h-11 w-full rounded-lg border ${hasError ? "border-red-400" : "border-border"} bg-background px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all`;

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
            aria-label={mode === "signin" ? "Sign in to Coffre" : "Create your Coffre account"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-8 w-full max-w-md rounded-2xl border border-border bg-background shadow-[0_30px_80px_-20px_rgba(17,17,17,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-tight">
                <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-border bg-foreground text-background text-[11px] font-semibold">C</span>
                Coffre
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
                {mode === "signin" ? "Welcome back." : "Create your account."}
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to your Coffre workspace."
                  : "Join thousands of investors growing their crypto portfolio."}
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
                  <h3 className="text-[18px] font-medium">{mode === "signin" ? "Signed in!" : "Account created!"}</h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">Redirecting to your dashboard…</p>
                </motion.div>
              ) : mode === "signin" ? (
                /* ── Sign-in ── */
                <motion.form key="signin" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}
                  className="px-6 pt-7 pb-6 space-y-4" onSubmit={handleSignin}>

                  <div>
                    <label className="block text-[12px] font-medium text-foreground">Email</label>
                    <input type="email" placeholder="you@company.com" autoComplete="email"
                      value={signin.email} onChange={setSigninField("email")} className={ic(!!signinErrors.email)} />
                    {signinErrors.email && <p className="mt-1 text-[11px] text-red-500">{signinErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-foreground">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                        autoComplete="current-password" value={signin.password} onChange={setSigninField("password")}
                        className={`${ic(!!signinErrors.password)} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground mt-1">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signinErrors.password && <p className="mt-1 text-[11px] text-red-500">{signinErrors.password}</p>}
                    <div className="mt-1.5 flex justify-end">
                      <button type="button" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {apiError && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{apiError}</div>}

                  <button type="submit" disabled={submitStatus === "loading"}
                    className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitStatus === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
                  </button>
                  <Divider />
                  <GoogleButton />
                </motion.form>
              ) : (
                /* ── Sign-up ── */
                <motion.form key="signup" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}
                  onSubmit={handleSignup} className="px-6 pt-6 pb-6 space-y-3.5">

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground">First name *</label>
                      <input type="text" placeholder="John" value={signup.firstName} onChange={setSignupField("firstName")} className={ic(!!signupErrors.firstName)} />
                      {signupErrors.firstName && <p className="mt-1 text-[11px] text-red-500">{signupErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground">Last name *</label>
                      <input type="text" placeholder="Doe" value={signup.lastName} onChange={setSignupField("lastName")} className={ic(!!signupErrors.lastName)} />
                      {signupErrors.lastName && <p className="mt-1 text-[11px] text-red-500">{signupErrors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground">Email *</label>
                    <input type="email" placeholder="you@company.com" autoComplete="email" value={signup.email} onChange={setSignupField("email")} className={ic(!!signupErrors.email)} />
                    {signupErrors.email && <p className="mt-1 text-[11px] text-red-500">{signupErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground">Phone *</label>
                    <input type="tel" placeholder="+357 99 261 501" autoComplete="tel" value={signup.phone} onChange={setSignupField("phone")} className={ic(!!signupErrors.phone)} />
                    {signupErrors.phone && <p className="mt-1 text-[11px] text-red-500">{signupErrors.phone}</p>}
                  </div>

                  {/* Country + investment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground">Country *</label>
                      <select value={signup.country} onChange={setSignupField("country")} className={ic(!!signupErrors.country)}>
                        <option value="">Select…</option>
                        {COUNTRY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      {signupErrors.country && <p className="mt-1 text-[11px] text-red-500">{signupErrors.country}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground">Invest amount *</label>
                      <select value={signup.howMuchInvested} onChange={setSignupField("howMuchInvested")} className={ic(!!signupErrors.howMuchInvested)}>
                        {INVESTMENT_OPTIONS.map((o) => <option key={o.value} value={o.value} disabled={!o.value}>{o.value ? o.label : "Select…"}</option>)}
                      </select>
                      {signupErrors.howMuchInvested && <p className="mt-1 text-[11px] text-red-500">{signupErrors.howMuchInvested}</p>}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground">Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password"
                        value={signup.password} onChange={setSignupField("password")} className={`${ic(!!signupErrors.password)} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground mt-1">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupErrors.password && <p className="mt-1 text-[11px] text-red-500">{signupErrors.password}</p>}
                  </div>

                  {apiError && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">{apiError}</div>}

                  <button type="submit" disabled={submitStatus === "loading"}
                    className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitStatus === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : "Create account"}
                  </button>
                  <Divider />
                  <GoogleButton />
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer toggle */}
            {submitStatus !== "success" && (
              <div className="border-t border-border bg-card/40 px-6 py-4 text-center text-[13px] text-muted-foreground rounded-b-2xl">
                {mode === "signin" ? (
                  <>New to Coffre?{" "}<button onClick={() => setMode("signup")} className="text-foreground hover:underline">Create an account</button></>
                ) : (
                  <>Already have an account?{" "}<button onClick={() => setMode("signin")} className="text-foreground hover:underline">Sign in</button></>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Shared atoms ──────────────────────────────────────────────────

function Divider() {
  return (
    <div className="relative flex items-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span className="flex-1 h-px bg-border" />
      <span className="px-3">or</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function GoogleButton() {
  return (
    <button type="button"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-[14px] font-medium text-foreground hover:bg-accent transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.12A6.99 6.99 0 0 1 5.46 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.96l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
      Continue with Google
    </button>
  );
}