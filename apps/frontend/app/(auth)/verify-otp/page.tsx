"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { authService } from "@/services/authService";
import Button from "@/components/ui/Button";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true);
    setError("");
    try {
      await authService.verifyOtp({ email, otp: code });
      router.push("/login?verified=1");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await authService.resendOtp({ email });
      setResendMsg("New code sent!");
    } catch {
      setResendMsg("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
          <Mail size={26} style={{ color: "#8B5CF6" }} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
          We sent a 6-digit verification code to{" "}
          <span className="font-medium" style={{ color: "#F1F5F9" }}>{email || "your email"}</span>
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl p-7"
        style={{ background: "rgba(15, 22, 41, 0.9)", border: "1px solid rgba(30, 45, 74, 0.8)", backdropFilter: "blur(12px)" }}>
        <div className="space-y-6">
          {/* OTP inputs */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: "#94A3B8" }}>
              Enter verification code
            </label>
            <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl transition-all duration-200"
                  style={{
                    background: digit ? "rgba(124, 58, 237, 0.15)" : "rgba(26, 35, 64, 0.8)",
                    border: digit ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(30, 45, 74, 0.8)",
                    color: "#F1F5F9",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(124, 58, 237, 0.6)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(124, 58, 237, 0.2)"; }}
                  onBlur={(e) => { if (!digit) { e.currentTarget.style.border = "1px solid rgba(30, 45, 74, 0.8)"; e.currentTarget.style.boxShadow = "none"; } }}
                />
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl text-sm text-red-400 text-center"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </motion.div>
          )}

          {resendMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-center"
              style={{ color: resendMsg.includes("sent") ? "#10B981" : "#EF4444" }}
            >
              {resendMsg}
            </motion.p>
          )}

          <Button fullWidth loading={loading} onClick={handleVerify} size="lg">
            Verify Email
          </Button>

          <div className="flex items-center justify-between pt-2">
            <Link href="/login"
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "#475569" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#94A3B8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
              <ArrowLeft size={14} />
              Back to login
            </Link>
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ color: "#8B5CF6" }}
            >
              <RefreshCw size={14} className={resendLoading ? "animate-spin" : ""} />
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
        Code expires in 10 minutes. Check your spam folder if you don&apos;t see it.
      </p>
    </motion.div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
