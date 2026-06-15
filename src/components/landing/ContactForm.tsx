import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, Loader2, Send } from "lucide-react";
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
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
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
      setApiError("Something went wrong. Please try again or email us directly.");
      setStatus("error");
    }
  };

  const ic = (field: keyof FormState) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-400" : "border-border"} bg-card/60 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all duration-200 backdrop-blur-sm`;

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.18_0_0_/_0.04)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              Get in touch
            </div>
            <h2 className="text-[30px] sm:text-[42px] font-medium tracking-[-0.03em] leading-[1.08]">
              Start your investment journey
            </h2>
            <p className="mt-4 text-[15px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Tell us about your goals and our advisors will craft a personalised crypto strategy for you.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(17,17,17,0.1)]">
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
                  >
                    <CheckCircle className="h-14 w-14 text-foreground" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-[22px] font-medium tracking-tight">Message sent!</h3>
                  <p className="text-[14px] text-muted-foreground max-w-xs leading-relaxed">
                    Thank you for reaching out. An advisor will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setForm(EMPTY); setStatus("idle"); setErrors({}); setApiError(""); }}
                    className="mt-2 inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Name */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground mb-2">Name *</label>
                    <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")} className={ic("name")} />
                    {errors.name && <p className="mt-1.5 text-[11px] text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email + phone */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground mb-2">Email address *</label>
                      <input type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} className={ic("email")} />
                      {errors.email && <p className="mt-1.5 text-[11px] text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground mb-2">Phone number *</label>
                      <input type="tel" placeholder="+357 99 261 501" value={form.phone} onChange={set("phone")} className={ic("phone")} />
                      {errors.phone && <p className="mt-1.5 text-[11px] text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[12px] font-medium text-foreground mb-2">Message (optional)</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your investment goals, experience, and what you're looking to achieve…"
                      value={form.message}
                      onChange={set("message")}
                      className={`${ic("message")} resize-none`}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                      {apiError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <p className="text-[12px] text-muted-foreground">
                      Your information is encrypted and never shared.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[14px] font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap shrink-0"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {status === "loading" ? "Submitting…" : "Submit enquiry"}
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
