"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "CANDIDATE" },
  });

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center gap-2 mb-3">
          <Image src="/logo.png" alt="JobOrbit" width={48} height={48} className="object-contain" />
          <span className="text-2xl font-bold">
            <span className="text-text-primary">job</span>
            <span className="gradient-text">Orbit</span>
          </span>
        </Link>
        <p className="text-text-muted text-sm">Create your JobOrbit account</p>
      </div>

      <Card className="shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            label="Email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Role selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(["CANDIDATE", "RECRUITER"] as const).map((role) => (
                <label key={role} className="cursor-pointer">
                  <input
                    type="radio"
                    value={role}
                    className="sr-only"
                    {...register("role")}
                  />
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-violet/50 transition-all has-[:checked]:border-violet has-[:checked]:bg-violet/10">
                    <Briefcase size={16} className="text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary capitalize">
                      {role === "CANDIDATE" ? "Job Seeker" : "Recruiter"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={isSubmitting} size="lg">
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-violet hover:text-violet-light font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
