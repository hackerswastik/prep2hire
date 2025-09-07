import React, { useMemo, useState } from "react";

// Prep2Hire: Single-file landing + registration page
// - TailwindCSS classes for styling
// - No external UI libs required
// - Simple client-side validation
// - Captures UTM params & source
// - Replace SUBMIT_URL with your API/Google Apps Script webhook

const SUBMIT_URL = "https://script.google.com/macros/s/PASTE_YOUR_DEPLOYMENT_ID/exec"; // Google Apps Script Web App endpoint
const WHATSAPP_LINK = "https://wa.me/7738652507?text=Hi%20Prep2Hire%2C%20I%20want%20to%20join%20the%20Java%20course"; // TODO: replace with your full number // TODO: change this to your backend/webhook

export default function Prep2HireLanding() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "Fresher",
    course: "Java + Spring Boot",
    batch: "Weekend (Sat–Sun)",
    goals: "",
    consent: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // Read UTM parameters for marketing attribution
  const utm = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      utm_term: p.get("utm_term") || "",
      utm_content: p.get("utm_content") || "",
      referrer: document.referrer || "",
    };
  }, []);

  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneOk = /^[0-9+\-()\s]{8,15}$/.test(form.phone);
    const nameOk = form.fullName.trim().length >= 2;
    if (!nameOk) return { ok: false, msg: "Please enter your full name." };
    if (!emailOk) return { ok: false, msg: "Please enter a valid email." };
    if (!phoneOk) return { ok: false, msg: "Please enter a valid phone number." };
    if (!form.consent) return { ok: false, msg: "Please accept the terms to continue." };
    return { ok: true };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    const v = validate();
    if (!v.ok) {
      setStatus({ type: "error", msg: v.msg });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, ...utm, submittedAt: new Date().toISOString(), userAgent: navigator.userAgent };
      const body = new URLSearchParams(payload).toString();
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      if (!res.ok) throw new Error("Failed to submit. Please try again.");
      setStatus({ type: "success", msg: "Registered! Check your email for next steps." });
      setForm((f) => ({ ...f, goals: "" }));
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-30 backdrop-blur bg-neutral-950/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500" />
            <span className="font-semibold tracking-wide">Prep2Hire</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#curriculum" className="hover:text-white">Curriculum</a>
            <a href="#why" className="hover:text-white">Why Us</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#register" className="px-3 py-1.5 rounded-xl bg-white text-neutral-900 font-medium">Register</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl bg-cyan-500/20" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl bg-emerald-500/20" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center text-xs uppercase tracking-widest text-emerald-300/90 bg-emerald-300/10 rounded-full px-3 py-1 border border-emerald-300/20">30 Days • Interview-Ready</span>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              Master Java & Spring Boot
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">by Building & Interviewing</span>
            </h1>
            <p className="mt-4 text-white/70 max-w-prose">
              Live cohorts, hands-on projects, mock interviews, and personalized feedback. Limited seats per batch—secure yours now.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/80">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Weekend-only cohorts</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Job-ready projects</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> 1:1 doubt support</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Certificate on completion</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#register" className="px-5 py-3 rounded-2xl bg-white text-neutral-900 font-semibold">Register Now</a>
              <a href="#curriculum" className="px-5 py-3 rounded-2xl border border-white/20 text-white/90">View Curriculum</a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-2xl border border-white/20 text-white/90">Chat on WhatsApp</a>
            </div>
            <p className="mt-3 text-xs text-white/50">Next cohort starts: <span className="font-medium text-white/80">Sept 21</span> • Early-bird ends soon</p>
          </div>

          {/* Registration Card (quick access) */}
          <div id="register" className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-semibold">Register for the Cohort</h2>
            <p className="mt-1 text-sm text-white/60">Fill your details and we’ll email the next steps within minutes.</p>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Full name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Swastik Srivastava" className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div>
                  <label className="text-sm text-white/70">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Phone (WhatsApp preferred)</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98XXXXXX" className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div>
                  <label className="text-sm text-white/70">Experience</label>
                  <select name="experience" value={form.experience} onChange={handleChange} className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400">
                    <option>Fresher</option>
                    <option>0–1 years</option>
                    <option>1–3 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Course</label>
                  <select name="course" value={form.course} onChange={handleChange} className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400">
                    <option>Java + Spring Boot</option>
                    <option>Full‑Stack: Java + React</option>
                    <option>Data Engineering (Java + Spark + SQL)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/70">Preferred batch</label>
                  <select name="batch" value={form.batch} onChange={handleChange} disabled className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60">
                    <option>Weekend (Sat–Sun)</option>
                  </select>
                  <p className="text-xs text-white/50 mt-1">Classes are held on weekends only.</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/70">Your goals (optional)</label>
                <textarea name="goals" value={form.goals} onChange={handleChange} placeholder="Tell us about your target role, timeline, or problem areas…" rows={3} className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1" />
                I agree to receive course updates over email/WhatsApp and accept the terms & privacy policy.
              </label>

              {status.msg && (
                <div className={`rounded-xl px-3 py-2 text-sm ${status.type === "error" ? "bg-red-500/10 text-red-300 border border-red-500/30" : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"}`}>
                  {status.msg}
                </div>
              )}

              <button disabled={submitting} className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-900 font-semibold px-5 py-3 disabled:opacity-60">
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    Submitting…
                  </>
                ) : (
                  <>Register Now</>
                )}
              </button>
              <p className="text-xs text-white/50">No spam. You can opt out anytime.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold">Why learners choose Prep2Hire</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { title: "Project-first learning", desc: "Ship a real-world app (APIs, DB, auth, deployment) you can demo in interviews." },
            { title: "Interview prep woven in", desc: "Daily MCQs, DSA drills, and weekly mock interviews with feedback." },
            { title: "Career outcomes", desc: "Resume revamp, LinkedIn polish, referrals, and job search strategy." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-5 bg-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 mb-3" />
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold">30‑Day Curriculum Snapshot</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-2 rounded-2xl border border-white/10 p-5 bg-white/5">
            <li><span className="text-emerald-300">Day 1–5:</span> Core Java, OOP, Collections</li>
            <li><span className="text-emerald-300">Day 6–10:</span> Streams, Generics, Exceptions</li>
            <li><span className="text-emerald-300">Day 11–15:</span> Spring Boot REST APIs, JPA/Hibernate</li>
            <li><span className="text-emerald-300">Day 16–20:</span> Security, JWT, Validation, Swagger</li>
            <li><span className="text-emerald-300">Day 21–25:</span> Microservices patterns, Kafka basics</li>
            <li><span className="text-emerald-300">Day 26–30:</span> Project build & interview prep</li>
          </ul>
          <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-br from-neutral-900 to-neutral-800">
            <h3 className="font-medium">Fees & Offers</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="text-white/70">Early-bird</div>
                <div className="text-2xl font-bold">₹9,999</div>
                <div className="text-xs text-white/50">till Sept 15</div>
              </div>
              <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="text-white/70">Standard</div>
                <div className="text-2xl font-bold">₹12,999</div>
                <div className="text-xs text-white/50">after Sept 15</div>
              </div>
            </div>
            <a href="#register" className="mt-4 inline-block px-4 py-2 rounded-xl bg-white text-neutral-900 font-semibold">Grab your seat</a>
            <p className="mt-2 text-xs text-white/50">EMI/No‑cost options available. Scholarships for deserving candidates.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          {[
            ["Is this live or recorded?", "Live sessions with recordings available for revision."],
            ["What if I miss a class?", "You can catch up via recordings and mentor office hours."],
            ["Do you provide placement support?", "Yes—resume, LinkedIn, referrals where possible, and interview prep."],
            ["What are the class timings?", "Weekend and weekday batches available. Pick what suits you."],
          ].map((qa, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-4 bg-white/5">
              <div className="font-medium">{qa[0]}</div>
              <div className="text-white/70 mt-1">{qa[1]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-white/60 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-white">Prep2Hire</div>
            <p className="mt-1">Career‑focused tech cohorts. Learn by building.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <p className="mt-1">Email: hello@prep2hire.com</p>
            <p>WhatsApp: <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="underline">Chat on WhatsApp</a></p>
          </div>
          <div>
            <div className="font-semibold text-white">Legal</div>
            <p className="mt-1">Terms • Privacy • Refund policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
