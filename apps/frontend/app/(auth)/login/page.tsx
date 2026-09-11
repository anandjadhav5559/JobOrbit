"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const response = await authService.login(data);
      setUser({
        userId: response.userId,
        email: response.email,
        role: response.role as "CANDIDATE" | "RECRUITER" | "ADMIN",
        accessToken: response.accessToken,
      });
      router.push("/feed");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e?.response?.data?.message || "Invalid credentials. Please try again."
      );
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
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-[#94A3B8] text-sm">
          Sign in to your account to continue your journey
        </p>
      </div>

      {/* Verified success banner */}
      {verified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 p-3.5 rounded-xl text-sm text-green-400"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <CheckCircle2 size={18} className="shrink-0" />
          Email verified successfully! You can now sign in.
        </motion.div>
      )}

      {/* Form card */}
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

          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#475569] hover:text-[#94A3B8] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex justify-end mt-1.5">
              <Link
                href="/forgot-password"
                className="text-xs font-medium transition-colors"
                style={{ color: "#8B5CF6" }}
              >
                Forgot password?
              </Link>
            </div>
          </div>

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
              Sign In
              <ArrowRight size={16} />
            </span>
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "rgba(30, 45, 74, 0.8)" }} />
          <span className="text-xs text-[#475569]">New to JobOrbit?</span>
          <div className="flex-1 h-px" style={{ background: "rgba(30, 45, 74, 0.8)" }} />
        </div>

        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", color: "#8B5CF6" }}
        >
          Create your free account
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Terms */}
      <p className="text-center text-[10px] text-[#475569] mt-6">
        By signing in you agree to our{" "}
        <span className="underline cursor-pointer hover:text-[#94A3B8] transition-colors">Terms of Service</span>
        {" "}and{" "}
        <span className="underline cursor-pointer hover:text-[#94A3B8] transition-colors">Privacy Policy</span>.
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
