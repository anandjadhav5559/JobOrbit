"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase, Search } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "CANDIDATE" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await authService.register(data);
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const passwordValue = watch("password") || "";
  const strength = passwordValue.length === 0 ? 0
    : passwordValue.length < 6 ? 1
    : passwordValue.length < 10 ? 2
    : /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue) ? 4 : 3;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#EF4444", "#F59E0B", "#10B981", "#7C3AED"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-[#94A3B8] text-sm">
          Join thousands of professionals on JobOrbit
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl p-7"
        style={{ background: "rgba(15, 22, 41, 0.9)", border: "1px solid rgba(30, 45, 74, 0.8)", backdropFilter: "blur(12px)" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Role selector — first for intent clarity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#94A3B8" }}>I am joining as a</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "CANDIDATE", label: "Job Seeker", desc: "Find & apply for jobs", icon: Search },
                { value: "RECRUITER", label: "Recruiter", desc: "Post jobs & hire talent", icon: Briefcase },
              ] as const).map(({ value, label, desc, icon: Icon }) => {
                const active = selectedRole === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("role", value)}
                    className="flex flex-col items-start gap-1.5 p-4 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: active ? "rgba(124, 58, 237, 0.15)" : "rgba(26, 35, 64, 0.6)",
                      border: active ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(30, 45, 74, 0.8)",
                      boxShadow: active ? "0 0 16px rgba(124, 58, 237, 0.15)" : "none",
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: active ? "rgba(124, 58, 237, 0.3)" : "rgba(30, 45, 74, 0.8)" }}>
                      <Icon size={16} style={{ color: active ? "#8B5CF6" : "#475569" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: active ? "#F1F5F9" : "#94A3B8" }}>{label}</p>
                      <p className="text-[11px]" style={{ color: active ? "#8B5CF6" : "#475569" }}>{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register("role")} />
            {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              leftIcon={<User size={16} />}
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="transition-colors"
                  style={{ color: "#475569" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
            {/* Password strength bar */}
            {passwordValue.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength ? strengthColors[strength] : "rgba(30, 45, 74, 0.8)" }}
                    />
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]} password
                </p>
              </div>
            )}
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
              Create Account
              <ArrowRight size={16} />
            </span>
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "rgba(30, 45, 74, 0.8)" }} />
          <span className="text-xs text-[#475569]">Already have an account?</span>
          <div className="flex-1 h-px" style={{ background: "rgba(30, 45, 74, 0.8)" }} />
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", color: "#8B5CF6" }}
        >
          Sign in to your account
          <ArrowRight size={14} />
        </Link>
      </div>

      <p className="text-center text-[10px] text-[#475569] mt-6">
        By creating an account you agree to our{" "}
        <span className="underline cursor-pointer hover:text-[#94A3B8] transition-colors">Terms of Service</span>
        {" "}and{" "}
        <span className="underline cursor-pointer hover:text-[#94A3B8] transition-colors">Privacy Policy</span>.
      </p>
    </motion.div>
  );
}
