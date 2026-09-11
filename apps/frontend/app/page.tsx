"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowRight, Zap, Users, Briefcase, TrendingUp,
  Search, Bell, MessageSquare, Star, CheckCircle2,
} from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Smart Job Discovery", desc: "AI-powered job matching based on your skills, experience, and preferences.", color: "#7C3AED" },
  { icon: Users, title: "Professional Network", desc: "Connect with 50K+ professionals. Grow your network and unlock opportunities.", color: "#06B6D4" },
  { icon: Briefcase, title: "Application Tracker", desc: "Keep all your job applications organized in one beautiful dashboard.", color: "#F97316" },
  { icon: MessageSquare, title: "Real-time Messaging", desc: "Chat with recruiters and connections instantly — no delays.", color: "#10B981" },
  { icon: Bell, title: "Smart Alerts", desc: "Get notified the moment a job matching your profile goes live.", color: "#7C3AED" },
  { icon: TrendingUp, title: "Career Analytics", desc: "Track your profile views, application stats, and network growth.", color: "#06B6D4" },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Software Engineer at Google", text: "Found my dream job in 2 weeks. The matching algorithm is insane!", avatar: "PS" },
  { name: "Rahul M.", role: "Senior PM at Flipkart", text: "Best professional networking platform I've used. Clean and powerful.", avatar: "RM" },
  { name: "Aisha K.", role: "UX Designer at Adobe", text: "The connections I made on JobOrbit completely changed my career.", avatar: "AK" },
];

const STATS = [
  { num: "50K+", label: "Active Professionals" },
  { num: "12K+", label: "Companies Hiring" },
  { num: "98%", label: "User Satisfaction" },
  { num: "2.5x", label: "Faster Hiring" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen" style={{ background: "#0A0E1A", color: "#F1F5F9" }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 lg:px-12"
        style={{ background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30, 45, 74, 0.5)" }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="white" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
                <circle cx="19" cy="5" r="1.5" fill="#22D3EE" />
              </svg>
            </div>
            <span className="text-lg font-bold">
              <span style={{ color: "#F1F5F9" }}>job</span>
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Orbit</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "For Recruiters", "Pricing"].map((l) => (
              <button key={l} className="text-sm transition-colors" style={{ color: "#94A3B8" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F1F5F9")}
                onMouseLeave={e => (e.currentTarget.style.color = "#94A3B8")}>
                {l}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              style={{ color: "#94A3B8" }}>
              Sign In
            </Link>
            <Link href="/register"
              className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", color: "white", boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" }}>
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7C3AED" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
          {/* Glows */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-15 animate-pulse"
            style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", animationDuration: "4s" }} />
          <div className="absolute top-40 right-0 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", animationDuration: "6s" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", animationDuration: "5s", animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold"
            style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.35)", color: "#8B5CF6" }}
          >
            <Zap size={12} />
            The Modern Professional Network
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Find your dream job.{" "}
            <span className="block mt-1" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Build your orbit.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: "#94A3B8" }}
          >
            JobOrbit connects ambitious professionals with the companies that need them most.
            Discover opportunities, expand your network, and launch your career.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register"
              className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)" }}>
              Start for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" }}>
              Sign In
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 mt-8 text-xs"
            style={{ color: "#475569" }}
          >
            <CheckCircle2 size={14} className="text-green-500" />
            Free to join · No credit card required · 2-minute setup
          </motion.div>
        </div>

        {/* Hero visual — floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto mt-16"
        >
          <div className="relative rounded-3xl overflow-hidden p-1"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.4))" }}>
            <div className="rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6"
              style={{ background: "#0F1629" }}>
              {/* Fake job cards */}
              {[
                { title: "Senior Frontend Engineer", company: "Stripe", type: "Remote", salary: "₹30–45 LPA", tag: "New", tagColor: "#10B981" },
                { title: "Product Manager", company: "Razorpay", type: "Hybrid", salary: "₹25–40 LPA", tag: "Hot", tagColor: "#F97316" },
                { title: "ML Engineer", company: "Google", type: "On-site", salary: "₹40–70 LPA", tag: "Featured", tagColor: "#7C3AED" },
              ].map((job, i) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex-1 rounded-2xl p-4 transition-transform duration-300 cursor-default"
                  style={{ background: "#141B2D", border: "1px solid #1E2D4A" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ background: "rgba(124, 58, 237, 0.2)", color: "#8B5CF6" }}>
                      {job.company[0]}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${job.tagColor}20`, color: job.tagColor }}>
                      {job.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{job.title}</h3>
                  <p className="text-xs mb-2" style={{ color: "#94A3B8" }}>{job.company}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#1E2D4A", color: "#475569" }}>{job.type}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(124,58,237,0.1)", color: "#8B5CF6" }}>{job.salary}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl"
                style={{ background: "rgba(15, 22, 41, 0.8)", border: "1px solid rgba(30, 45, 74, 0.6)" }}
              >
                <p className="text-3xl font-black mb-1"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {s.num}
                </p>
                <p className="text-sm" style={{ color: "#94A3B8" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-white mb-4"
            >
              Everything you need to{" "}
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                level up
              </span>
            </motion.h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
              Powerful tools designed to help you land opportunities and build meaningful connections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
                style={{ background: "#0F1629", border: "1px solid #1E2D4A" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${f.color}40`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${f.color}15`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid #1E2D4A";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">
              Loved by professionals
            </h2>
            <p className="text-base" style={{ color: "#94A3B8" }}>
              Thousands of people found their next opportunity on JobOrbit.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: "#0F1629", border: "1px solid #1E2D4A" }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" className="text-yellow-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#94A3B8" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(6,182,212,0.2) 100%)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            {/* Background circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", animationDelay: "1s" }} />

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Ready to launch<br />your career?
              </h2>
              <p className="text-lg mb-8" style={{ color: "#94A3B8" }}>
                Join 50,000+ professionals already using JobOrbit.
              </p>
              <Link href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}>
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <p className="text-xs mt-4" style={{ color: "#475569" }}>
                No credit card required · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ borderTop: "1px solid rgba(30, 45, 74, 0.6)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="white" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
              </svg>
            </div>
            <span className="text-sm font-bold">
              <span style={{ color: "#F1F5F9" }}>job</span>
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Orbit</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: "#475569" }}>
            © {new Date().getFullYear()} JobOrbit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <button key={l} className="text-xs transition-colors" style={{ color: "#475569" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#94A3B8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
