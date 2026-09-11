import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to JobOrbit",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden px-12 py-14"
        style={{ background: "linear-gradient(160deg, #0F1629 0%, #0A0E1A 50%, #120A24 100%)" }}>

        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20 animate-pulse"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", animationDuration: "4s" }} />
          <div className="absolute -bottom-32 -right-16 w-[350px] h-[350px] rounded-full opacity-15 animate-pulse"
            style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", animationDuration: "6s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7C3AED" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Brand logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="white" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
                <circle cx="19" cy="5" r="1.5" fill="#22D3EE" />
              </svg>
            </div>
            <span className="text-xl font-bold">
              <span style={{ color: "#F1F5F9" }}>job</span>
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Orbit</span>
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your career,<br />
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>in orbit.</span>
          </h2>
          <p className="text-[#94A3B8] text-base leading-relaxed mb-10">
            Connect with top professionals, discover opportunities that match your goals, and grow your career network.
          </p>

          {/* Feature highlights */}
          <div className="space-y-5">
            {[
              { emoji: "🚀", title: "Discover Opportunities", desc: "Browse thousands of curated jobs across all industries" },
              { emoji: "🤝", title: "Expand Your Network", desc: "Connect with professionals and build meaningful relationships" },
              { emoji: "📊", title: "Track Applications", desc: "Manage your job applications in one place" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                  style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
                  {f.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-[#475569] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { num: "50K+", label: "Professionals" },
            { num: "12K+", label: "Companies" },
            { num: "98%", label: "Satisfaction" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.num}</p>
              <p className="text-[10px] text-[#475569] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Mobile background blobs */}
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", animationDelay: "1s" }} />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="white" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
              </svg>
            </div>
            <span className="text-base font-bold">
              <span style={{ color: "#F1F5F9" }}>job</span>
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Orbit</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
