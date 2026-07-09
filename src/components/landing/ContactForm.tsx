import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, Loader2, Send, Zap } from "lucide-react";
import { useState } from "react";
import { submitLead } from "@/lib/crmApi";

// ─── Constants ─────────────────────────────────────────────────────

const INVESTMENT_OPTIONS = [
  { value: "", label: "Select amount…" },
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

// ─── Types ─────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

// ─── Component ─────────────────────────────────────────────────────

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = useState("");

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail valide requis";
    
    const cleanNum = form.phone.replace(/\s+/g, "");
    if (!cleanNum) {
      e.phone = "Veuillez entrer un numéro de téléphone";
    } else if (!/^(\+41|0041|0)?[1-9]\d{8}$/.test(cleanNum)) {
      e.phone = "Veuillez entrer un numéro suisse valide (ex: 079 123 45 67)";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setApiError("");
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setApiError("Un problème est survenu. Veuillez réessayer ou nous envoyer un e-mail directement.");
      setStatus("error");
    }
  };

  const ic = (field: keyof FormState) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-gray-800 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(251,191,36,0.2)]"} bg-black/60 px-4 py-3 text-[14px] text-white placeholder:text-gray-600 outline-none transition-all duration-300 backdrop-blur-md`;

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32 bg-[#050505]">
      {/* Ambient glow */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.15)_0%,transparent_70%)]" 
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-black/60 px-4 py-1.5 text-[12px] text-amber-500 font-bold neon-border-amber">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-amber-500" />
              Initialiser la connexion
            </div>
            <h2 className="text-[30px] sm:text-[42px] font-bold tracking-[-0.03em] leading-[1.08] text-white">
              Connectez-vous au réseau
            </h2>
            <p className="mt-4 text-[15px] sm:text-[17px] text-gray-400 leading-relaxed max-w-lg mx-auto">
              Partagez vos paramètres d'investissement et nos protocoles généreront une stratégie crypto sur mesure pour vous.
            </p>
          </div>

          {/* Card */}
          <div className="relative rounded-2xl border border-gray-800 bg-black/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 rounded-2xl border border-amber-500/10 pointer-events-none" />
            <AnimatePresence mode="wait">
              {/* ── Success ── */}
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-4 py-14 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                    <CheckCircle className="h-16 w-16 text-green-500 relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-[24px] font-bold tracking-tight text-white mt-4">Transaction Confirmée</h3>
                  <p className="text-[15px] text-gray-400 max-w-xs leading-relaxed">
                    Votre message a été haché et transmis. Un opérateur réseau vous contactera sous peu.
                  </p>
                  <button
                    onClick={() => { setForm(EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                    className="mt-6 inline-flex h-11 items-center rounded-full border border-gray-700 bg-black px-6 text-[14px] font-bold text-white hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all"
                  >
                    Nouvelle Transmission
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Name */}
                  <div className="group">
                    <label className="block text-[12px] font-bold text-gray-400 mb-2 group-focus-within:text-amber-500 transition-colors">Identifiant (Nom) *</label>
                    <input type="text" placeholder="Satoshi Nakamoto" value={form.name} onChange={set("name")} className={ic("name")} />
                    {errors.name && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email + phone */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[12px] font-bold text-gray-400 mb-2 group-focus-within:text-amber-500 transition-colors">Clé Publique (Email) *</label>
                      <input type="email" placeholder="satoshi@bitcoin.org" value={form.email} onChange={set("email")} className={ic("email")} />
                      {errors.email && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.email}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-[12px] font-bold text-gray-400 mb-2 group-focus-within:text-amber-500 transition-colors">Canal de Com. (Téléphone) *</label>
                      
<div style={{ display: 'flex', gap: '8px', width: '100%' }}>
    <select name="countryCode" style={{ width: '110px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '0.8rem', fontFamily: 'inherit' }}>
        <option value="CH">🇨🇭 +41</option>
        <option value="GB">🇬🇧 +44</option>
        <option value="CA">🇨🇦 +1</option>
        <option value="AU">🇦🇺 +61</option>
    </select>
<input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={set("phone")} className={ic("phone")}  style={{ flex: 1 }} />
</div>
                      {errors.phone && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-[12px] font-bold text-gray-400 mb-2 group-focus-within:text-amber-500 transition-colors">Payload (Message)</label>
                    <textarea
                      rows={5}
                      placeholder="Décrivez vos objectifs de yield, votre tolérance au risque et les actifs ciblés..."
                      value={form.message}
                      onChange={set("message")}
                      className={`${ic("message")} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-[13px] text-red-400 font-medium shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                      {apiError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-800">
                    <p className="text-[12px] text-gray-500 flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />
                      Chiffré de bout en bout. Zéro conservation.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 text-[14px] font-bold text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] disabled:opacity-60 whitespace-nowrap shrink-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                      ) : (
                        <Send className="h-4 w-4 relative z-10" />
                      )}
                      <span className="relative z-10">{status === "loading" ? "Transmission..." : "Exécuter la Transaction"}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
