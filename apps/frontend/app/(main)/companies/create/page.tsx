"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Building2, Globe, MapPin, Tag, ChevronLeft, Plus } from "lucide-react";
import { ROUTES } from "@/utils/constants";

const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.startsWith("http://") || v.startsWith("https://"),
      "Must be a valid URL starting with http:// or https://"
    ),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media",
  "Real Estate",
  "Other",
];

export default function CreateCompanyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => companyService.createCompany(data),
    onSuccess: (company) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push(ROUTES.COMPANY_DETAIL(company.id));
    },
  });

  // Guard — only recruiters can create companies
  if (user?.role !== "RECRUITER") {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <Building2 size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
        <h2 className="text-lg font-semibold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted text-sm">Only recruiters can create company pages.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <Card>
        <CardTitle className="mb-6 flex items-center gap-2 text-xl">
          <Building2 size={22} className="text-violet" />
          Create Company Page
        </CardTitle>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          {/* Company Name */}
          <Input
            label="Company Name *"
            placeholder="e.g. Acme Corp"
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Industry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
              <Tag size={13} className="text-text-muted" />
              Industry
            </label>
            <select
              {...register("industry")}
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
            >
              <option value="">Select an industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <Input
            label="Location"
            placeholder="e.g. Bangalore, India"
            error={errors.location?.message}
            leadingIcon={<MapPin size={14} className="text-text-muted" />}
            {...register("location")}
          />

          {/* Website */}
          <Input
            label="Website"
            placeholder="https://yourcompany.com"
            error={errors.website?.message}
            leadingIcon={<Globe size={14} className="text-text-muted" />}
            {...register("website")}
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Tell people what your company does, your mission, culture..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              Failed to create company. Please try again.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={mutation.isPending || isSubmitting}
              className="flex-1"
            >
              <Plus size={14} />
              Create Company
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
