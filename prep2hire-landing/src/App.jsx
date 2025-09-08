import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Prep2Hire: Single-file landing + registration page
// - TailwindCSS styling
// - Captures UTM params & source
// - Submits to Google Apps Script Web App
// - Success page redirect (/thanks) with client-side routing
// - Course-specific syllabus accordions
// - Subtle animations via Framer Motion

const SUBMIT_URL =
  "https://script.google.com/macros/s/AKfycbzbakaddOXLko2KocgpKxUNgyEznJLHulTkTmXzSMNDfyfqpFXQWMaqCRu5kD6g4QeEhQ/exec";
const WHATSAPP_LINK =
  "https://wa.me/917738652507?text=Hi%20Prep2Hire%2C%20I%20want%20to%20join%20the%20course";

const syllabus = {
  "Java (Core + Advanced)": [
    "Java Basics, OOP, Collections, Generics",
    "Exceptions, Streams, Lambda, File I/O",
    "Threads & Concurrency, JVM Internals",
    "Clean Code, Testing, Mini Project",
  ],
  "Spring / Spring Boot": [
    "Spring Core, Boot Starter, Profiles",
    "REST APIs, Validation, DTO mapping",
    "JPA/Hibernate, Pagination, Caching",
    "Security (JWT), Actuator, Swagger",
  ],
  React: [
    "Components, Props/State, Hooks",
    "Forms & Validation, Routing",
    "API calls (fetch/axios), Auth flows",
    "Performance, Testing, Deployment",
  ],
  Angular: [
    "Components, Modules, Services",
    "Reactive Forms, Routing, Guards",
    "HTTP Client, Interceptors, State",
    "Testing, Build & Deployment",
  ],
  ".NET": [
    "C# Fundamentals, OOP",
    "ASP.NET Core APIs, EF Core",
    "Auth, Logging, Deployment",
    "Testing & Clean Architecture",
  ],
  "Full Stack (Java + Spring Boot + React)": [
    "Backend: Entities, Repos, Services, APIs",
    "Frontend: React UI, Forms, Auth",
    "Integration: JWT, CORS, Error handling",
    "Project: CRUD, Search, Pagination, Deploy",
  ],
};

function Accordion({ title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium">{title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pt-0 pb-4 text-sm space-y-2 border-t border-white/10"
          >
            {items.map((it, i) => (
              <li key={i} className="text-white/80">• {it}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThanksView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl"
        >
          🎉
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold">Registration Received</h1>
        <p className="mt-2 text-white/70">
          Thanks for registering! We’ve sent a confirmation email and will contact you with next steps.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="/" className="px-5 py-3 rounded-2xl bg-white text-neutral-900 font-semibold">
            Back to Home
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl border border-white/20 text-white/90"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Prep2HireLanding() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "Fresher",
    course: "Java (Core + Advanced)",
    batch: "Weekend (Sat–Sun)",
    goals: "",
    consent: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [backendOk, setBackendOk] = useState(null);
  const [path, setPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  // Capture UTM params
  const utm = useMemo(() => {
    const p = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    return {
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      utm_term: p.get("utm_term") || "",
      utm_content: p.get("utm_content") || "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };
  }, []);

  // Connectivity badge
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(SUBMIT_URL);
        setBackendOk(resp.ok);
      } catch {
        setBackendOk(false);
      }
    })();
  }, []);

  // Tiny client-side router
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

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
      const payload = {
        ...form,
        ...utm,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };
      const body = new URLSearchParams(payload).toString();
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {}
      if (data && data.ok === false) throw new Error(data.error || "Server returned ok=false");
      setStatus({ type: "success", msg: "Registered! Redirecting…" });
      setTimeout(() => navigate("/thanks"), 700);
      setForm((f) => ({ ...f, goals: "" }));
    } catch (err) {
      setStatus({ type: "error", msg: `Submit failed: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  if (path === "/thanks") return <ThanksView />;

  return (
    <div className="min-h-screen w-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-30 backdrop-blur bg-neutral-950/70 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500" />
            <span className="font-semibold tracking-wide">Prep2Hire</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#curriculum" className="hover:text-white">
              Curriculum
            </a>
            <a href="#why" className="hover:text-white">
              Why Us
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a
              href="#register"
              className="px-3 py-1.5 rounded-xl bg-white text-neutral-900 font-medium"
            >
              Register
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 -z-10 w-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl bg-cyan-500/20"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center text-xs uppercase tracking-widest text-emerald-300/90 bg-emerald-300/10 rounded-full px-3 py-1 border border-emerald-300/20">
              Weekend Mentorship • Real Projects
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              Crack Your Interview Faster
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Java • Spring Boot • React • Angular • .NET
              </span>
            </h1>
            <p className="mt-4 text-white/70 max-w-prose">
              Live weekend-only cohorts, hands-on projects, mock interviews, and personalized
              feedback across multiple tech stacks.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Weekend-only cohorts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Job-ready projects
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 1:1 doubt support
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Certificate on completion
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#register"
                className="px-5 py-3 rounded-2xl bg-white text-neutral-900 font-semibold"
              >
                Register Now
              </a>
              <a
                href="#curriculum"
                className="px-5 py-3 rounded-2xl border border-white/20 text-white/90"
              >
                View Curriculum
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl border border-white/20 text-white/90"
              >
                Chat on WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-white/50">
              Weekend Classes Only • Flexible timings • College-friendly
            </p>
          </motion.div>

          {/* Registration Card */}
          <motion.div
            id="register"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <h2 className="text-xl font-semibold">Register for the Cohort</h2>
            <p className="mt-1 text-sm text-white/60">
              Fill your details and we’ll email the next steps within minutes.
            </p>
            {backendOk !== null && (
              <div
                className={`mt-2 inline-flex items-center gap-2 text-xs rounded-full px-2.5 py-1 border ${
                  backendOk
                    ? "border-emerald-400/40 text-emerald-300 bg-emerald-400/10"
                    : "border-red-400/40 text-red-300 bg-red-400/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendOk ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                {backendOk ? "Connected to Google Sheet" : "Cannot reach Google Sheet"}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Full name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Phone (WhatsApp preferred)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g., +91 98XXXXXX"
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Experience</label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  >
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
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option>Java (Core + Advanced)</option>
                    <option>Spring / Spring Boot</option>
                    <option>React</option>
                    <option>Angular</option>
                    <option>.NET</option>
                    <option>Full Stack (Java + Spring Boot + React)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/70">Preferred batch</label>
                  <select
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    disabled
                    className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60"
                  >
                    <option>Weekend (Sat–Sun)</option>
                  </select>
                  <p className="text-xs text-white/50 mt-1">Classes are held on weekends only.</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/70">Your goals (optional)</label>
                <textarea
                  name="goals"
                  value={form.goals}
                  onChange={handleChange}
                  placeholder="Tell us about your target role, timeline, or problem areas…"
                  rows={3}
                  className="mt-1 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  className="mt-1"
                />
                I agree to receive course updates over email/WhatsApp and accept the terms & privacy
                policy.
              </label>

              {status.msg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    status.type === "error"
                      ? "bg-red-500/10 text-red-300 border border-red-500/30"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {status.msg}
                </motion.div>
              )}

              <button
                disabled={submitting || backendOk === false}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-900 font-semibold px-5 py-3 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>Register Now</>
                )}
              </button>
              <p className="text-xs text-white/50">No spam. You can opt out anytime.</p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Why Mentorship */}
      <section id="why" className="w-full bg-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-semibold">
            ✨ Why Mentorship is the Shortcut to Your First Job ✨
          </h2>
          <p className="mt-3 text-white/70 max-w-3xl">
            In today's competitive job market, skills alone aren't enough. What truly makes the
            difference? <span className="text-white">Right mentorship.</span>
          </p>
          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <ul className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-2">
              <li>✅ Show you how to apply knowledge to real-world problems</li>
              <li>✅ Help you avoid common mistakes that freshers make</li>
              <li>✅ Guide you on resume building and interview strategy</li>
              <li>✅ Share insider tips from industry experience</li>
              <li>✅ Keep you accountable so you stay consistent</li>
            </ul>
            <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
              <div className="font-medium">🎯 What We Offer</div>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✅ Java (Core + Advanced)</li>
                <li>✅ Spring &amp; Spring Boot</li>
                <li>✅ Full Stack Development (Java + React / Angular)</li>
                <li>✅ .NET Development</li>
                <li>✅ Frontend: React &amp; Angular</li>
              </ul>
              <div className="mt-4 text-sm text-white/80">
                <div>💰 Pocket-Friendly Pricing starting at just ₹999</div>
                <div className="mt-1">
                  📚 Choose from: Hourly Concepts • Full Course • Full Course + Hands-on Projects
                </div>
                <div className="mt-2">
                  🎁 Free Add-ons: Resume Templates • Mock Interviews • Placement Tips • GitHub
                  Guidance
                </div>
                <div className="mt-2">🗓 Weekend Classes Only • 🕒 Flexible Timings • 🎓 College-friendly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum + Pricing */}
      <section id="curriculum" className="w-full bg-neutral-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-semibold">Curriculum & Weekend Plan</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              {Object.entries(syllabus).map(([title, items]) => (
                <Accordion key={title} title={title} items={items} />
              ))}
            </div>

            <div
              id="pricing"
              className="rounded-2xl border border-white/10 p-5 bg-gradient-to-br from-neutral-900 to-neutral-800"
            >
              <h3 className="font-medium">💰 Weekend Tech Classes – Pricing &amp; Duration</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-white/70">
                    <tr className="border-b border-white/10">
                      <th className="py-2 pr-3">Course</th>
                      <th className="py-2 pr-3">Duration</th>
                      <th className="py-2 pr-3">Concepts Only (INR)</th>
                      <th className="py-2">Concepts + Hands-on (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/90">
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-3">Java (Core + Advanced)</td>
                      <td className="py-2 pr-3">6–7 weekends (22 hrs)</td>
                      <td className="py-2 pr-3">₹5,999</td>
                      <td className="py-2">₹8,999</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-3">Spring / Spring Boot</td>
                      <td className="py-2 pr-3">5 weekends (18 hrs)</td>
                      <td className="py-2 pr-3">₹4,999</td>
                      <td className="py-2">₹7,999</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-3">React</td>
                      <td className="py-2 pr-3">5 weekends (18 hrs)</td>
                      <td className="py-2 pr-3">₹4,999</td>
                      <td className="py-2">₹7,999</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-3">Angular</td>
                      <td className="py-2 pr-3">5 weekends (18 hrs)</td>
                      <td className="py-2 pr-3">₹4,999</td>
                      <td className="py-2">₹7,999</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-3">.NET</td>
                      <td className="py-2 pr-3">6 weekends (20 hrs)</td>
                      <td className="py-2 pr-3">₹5,999</td>
                      <td className="py-2">₹8,999</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3">Full Stack Java (Java + Spring Boot + React)</td>
                      <td className="py-2 pr-3">10+ weekends (45+ hrs)</td>
                      <td className="py-2 pr-3">₹12,999</td>
                      <td className="py-2">₹17,999</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <a
                href="#register"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-white text-neutral-900 font-semibold"
              >
                Grab your seat
              </a>
              <p className="mt-2 text-xs text-white/50">
                Hourly concept sessions available from ₹999.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-white/60 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-white">Prep2Hire</div>
            <p className="mt-1">Career-focused tech cohorts. Learn by building.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <p className="mt-1">Email: 	prep2hiire@gmail.com</p>
            <p>
              WhatsApp:{" "}
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="underline">
                Chat on WhatsApp
              </a>
            </p>
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