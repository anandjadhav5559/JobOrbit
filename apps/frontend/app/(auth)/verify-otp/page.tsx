"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }
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
      setResendMsg("OTP resent! Check your email.");
    } catch {
      setResendMsg("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-violet/20 border border-violet/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📧</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Verify your email</h1>
        <p className="text-text-muted text-sm mt-2">
          We sent a 6-digit code to <span className="text-text-primary">{email}</span>
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* OTP inputs */}
          <div className="flex gap-2 justify-center">
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
                className="w-12 h-14 text-center text-xl font-bold bg-bg-elevated border border-border rounded-xl text-text-primary focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {resendMsg && (
            <p className="text-sm text-center text-green-400">{resendMsg}</p>
          )}

          <Button fullWidth loading={loading} onClick={handleVerify} size="lg">
            Verify Email
          </Button>

          <div className="text-center">
            <p className="text-sm text-text-muted">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-violet hover:text-violet-light font-medium transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </p>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
              ← Back to login
            </Link>
          </div>
        </div>
      </Card>
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
