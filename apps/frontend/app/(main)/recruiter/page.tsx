"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService, applicationService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Job, Application, CreateJobRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ROUTES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/utils/constants";
import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  Eye,
  EyeOff,
  Edit3,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";

const jobSchema = z.object({
  title: z.string().min(2, "Required"),
  description: z.string().min(10, "At least 10 characters"),
  location: z.string().min(2, "Required"),
  employmentType: z.string().min(1, "Required"),
  experienceLevel: z.string().min(1, "Required"),
  salary: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

const statusVariant: Record<string, "muted" | "warning" | "cyan" | "danger" | "success"> = {
  PENDING: "warning",
  REVIEWED: "muted",
  SHORTLISTED: "cyan",
  REJECTED: "danger",
  ACCEPTED: "success",
};

export default function RecruiterDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: myJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recruiter-jobs", user?.userId],
    queryFn: () => jobService.getJobsByRecruiter(user!.userId),
    enabled: !!user,
  });

  const { data: applicants, isLoading: appsLoading } = useQuery({
    queryKey: ["job-applicants", selectedJob?.id],
    queryFn: () => applicationService.getApplicationsByJob(selectedJob!.id),
    enabled: !!selectedJob,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: CreateJobRequest) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
      setCreateOpen(false);
      reset();
    },
  });

  const closeMutation = useMutation({
    mutationFn: (jobId: number) => jobService.closeJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (jobId: number) => jobService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
      if (selectedJob?.id === deleteMutation.variables) setSelectedJob(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      applicationService.updateApplicationStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job-applicants"] }),
  });

  // ── Form ──────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({ resolver: zodResolver(jobSchema) });

  if (jobsLoading) return <PageSpinner />;

  const openJobs = (myJobs || []).filter((j: Job) => j.status === "OPEN");
  const closedJobs = (myJobs || []).filter((j: Job) => j.status !== "OPEN");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Recruiter Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {openJobs.length} open · {closedJobs.length} closed
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={14} />
          Post a Job
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Job list */}
        <div className="space-y-3">
          <CardTitle className="text-text-secondary text-sm uppercase tracking-wide mb-2">
            Your Postings
          </CardTitle>

          {(myJobs || []).length === 0 ? (
            <Card className="text-center py-12">
              <Briefcase size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
              <p className="text-text-muted text-sm">No jobs posted yet</p>
            </Card>
          ) : (
            (myJobs || []).map((job: Job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <Card
                  key={job.id}
                  hover
                  padding="md"
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-1 ring-violet border-violet" : ""
                  }`}
                  onClick={() => setSelectedJob(isSelected ? null : job)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-text-primary text-sm">{job.title}</h3>
                        <Badge variant={job.status === "OPEN" ? "success" : "muted"} dot>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {job.location} · {job.employmentType?.replace("_", " ")}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Posted {formatDate(job.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        title="View job"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(ROUTES.JOB_DETAIL(job.id));
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-cyan hover:bg-cyan/10 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      {job.status === "OPEN" && (
                        <button
                          title="Close job"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeMutation.mutate(job.id);
                          }}
                          className="p-1.5 rounded-lg text-text-muted hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        >
                          <EyeOff size={14} />
                        </button>
                      )}
                      <button
                        title="Delete job"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(job.id);
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right: Applicants panel */}
        <div>
          {selectedJob ? (
            <Card>
              <CardTitle className="mb-4 flex items-center gap-2">
                <Users size={18} className="text-violet" />
                Applicants for &ldquo;{selectedJob.title}&rdquo;
              </CardTitle>

              {appsLoading ? (
                <p className="text-sm text-text-muted">Loading...</p>
              ) : !applicants || applicants.length === 0 ? (
                <p className="text-sm text-text-muted py-6 text-center">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {applicants.map((app: Application) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-bg-elevated border border-border"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {app.candidateName || `Candidate #${app.candidateId}`}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            Applied {formatDate(app.appliedAt)}
                          </p>
                          {app.coverLetter && (
                            <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">
                              {app.coverLetter}
                            </p>
                          )}
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({ id: app.id, status: e.target.value })
                          }
                          className="shrink-0 bg-bg-card border border-border rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-violet"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="ACCEPTED">Accepted</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <Card className="text-center py-16 text-text-muted">
              <Edit3 size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a job to view applicants</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); reset(); }}
        title="Post a New Job"
      >
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input label="Job Title" error={errors.title?.message} {...register("title")} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Employment Type</label>
              <select
                {...register("employmentType")}
                className="bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30"
              >
                <option value="">Select...</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Experience Level</label>
              <select
                {...register("experienceLevel")}
                className="bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30"
              >
                <option value="">Select...</option>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Location" error={errors.location?.message} {...register("location")} />
          <Input label="Salary (optional)" placeholder="e.g. ₹12-18 LPA" {...register("salary")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the role, responsibilities, requirements..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30"
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setCreateOpen(false); reset(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending || isSubmitting} className="flex-1">
              <Plus size={14} />
              Post Job
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
