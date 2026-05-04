"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { companyService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Tag,
  ChevronLeft,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
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

interface EditCompanyPageProps {
  params: { companyId: string };
}

export default function EditCompanyPage({ params }: EditCompanyPageProps) {
  const companyId = parseInt(params.companyId);
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Fetch existing company data
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyService.getCompanyById(companyId),
  });

  // Prefill form once data loads
  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        industry: company.industry || "",
        location: company.location || "",
        website: company.website || "",
        description: company.description || "",
      });
    }
  }, [company, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => companyService.updateCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push(ROUTES.COMPANY_DETAIL(companyId));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => companyService.deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.replace(ROUTES.COMPANIES);
    },
  });

  // Access guard — only owner (recruiter) or admin
  const isOwner = company?.ownerId === user?.userId;
  const isAdmin = user?.role === "ADMIN";

  if (isLoading) return <PageSpinner />;
  if (!company) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <Building2 size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
        <p className="text-text-muted">Company not found.</p>
      </div>
    );
  }
  if (!isOwner && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-400 opacity-60" />
        <h2 className="text-lg font-semibold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted text-sm">You can only edit companies you own.</p>
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
        <div className="flex items-start justify-between mb-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 size={22} className="text-violet" />
            Edit Company Page
          </CardTitle>

          {/* Delete button — owner or admin */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-5">
          <Input
            label="Company Name *"
            placeholder="e.g. Acme Corp"
            error={errors.name?.message}
            {...register("name")}
          />

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

          <Input
            label="Location"
            placeholder="e.g. Bangalore, India"
            error={errors.location?.message}
            leadingIcon={<MapPin size={14} className="text-text-muted" />}
            {...register("location")}
          />

          <Input
            label="Website"
            placeholder="https://yourcompany.com"
            error={errors.website?.message}
            leadingIcon={<Globe size={14} className="text-text-muted" />}
            {...register("website")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Tell people what your company does..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
            />
          </div>

          {updateMutation.isError && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              Failed to update company. Please try again.
            </p>
          )}

          {updateMutation.isSuccess && (
            <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
              ✓ Company updated successfully
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
              loading={updateMutation.isPending || isSubmitting}
              disabled={!isDirty}
              className="flex-1"
            >
              <Save size={14} />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Company"
      >
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Delete &ldquo;{company.name}&rdquo;?
          </h3>
          <p className="text-text-muted text-sm mb-6">
            This action cannot be undone. All jobs posted under this company will also be
            affected.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="flex-1"
            >
              <Trash2 size={14} />
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
