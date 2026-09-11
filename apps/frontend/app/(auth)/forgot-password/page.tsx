"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({ email: z.string().email("Invalid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await authService.forgotPassword(data);
      setSentEmail(data.email);
      setSent(true);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {sent ? (
        /* ── Success state ─── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Check your inbox</h1>
          <p className="text-sm mb-2" style={{ color: "#94A3B8" }}>
            We sent a password reset link to
          </p>
          <p className="font-semibold mb-6" style={{ color: "#F1F5F9" }}>{sentEmail}</p>
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(15, 22, 41, 0.9)", border: "1px solid rgba(30, 45, 74, 0.8)" }}>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              Redirecting you to reset password page in a moment...
            </p>
            <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: "rgba(30, 45, 74, 0.8)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
          <Link href="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm transition-colors"
            style={{ color: "#475569" }}>
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </motion.div>
      ) : (
        /* ── Form state ─── */
        <>
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
              <Mail size={26} style={{ color: "#8B5CF6" }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              No worries — enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="rounded-2xl p-7"
            style={{ background: "rgba(15, 22, 41, 0.9)", border: "1px solid rgba(30, 45, 74, 0.8)", backdropFilter: "blur(12px)" }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                {...register("email")}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl text-sm text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" fullWidth loading={isSubmitting} size="lg">
                <span className="flex items-center justify-center gap-2">
                  Send Reset Link
                  <ArrowRight size={16} />
                </span>
              </Button>

              <div className="text-center">
                <Link href="/login"
                  className="inline-flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#94A3B8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
}
