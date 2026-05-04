"use client";

import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/jobService";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { MapPin, Clock, DollarSign, ChevronLeft, Building2 } from "lucide-react";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/utils/constants";
import { formatDate } from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";
import ApplicationModal from "@/components/jobs/ApplicationModal";
import { useState } from "react";

interface JobDetailPageProps {
  params: { jobId: string };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const jobId = parseInt(params.jobId);
  const router = useRouter();
  const { user } = useAuthStore();
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobService.getJobById(jobId),
  });

  if (isLoading) return <PageSpinner />;
  if (!job) return <div className="text-center py-20 text-text-muted">Job not found</div>;

  const employmentLabel = EMPLOYMENT_TYPES.find((t) => t.value === job.employmentType)?.label || job.employmentType;
  const experienceLabel = EXPERIENCE_LEVELS.find((l) => l.value === job.experienceLevel)?.label || job.experienceLevel;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Jobs
      </button>

      {/* Header */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center shrink-0">
            <Building2 size={28} className="text-text-muted" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
            <p className="text-text-secondary">{job.companyName || "Company"}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
              <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{employmentLabel}</span>
              {job.salary && <span className="flex items-center gap-1"><DollarSign size={14} />{job.salary}</span>}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={job.status === "OPEN" ? "success" : "danger"} dot>
                {job.status}
              </Badge>
              <Badge variant="muted">{experienceLabel}</Badge>
              <span className="text-xs text-text-muted">Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          {user?.role === "CANDIDATE" && job.status === "OPEN" && (
            <Button onClick={() => setApplyOpen(true)} size="lg">
              Apply Now
            </Button>
          )}
        </div>
      </Card>

      {/* Description */}
      <Card>
        <CardTitle className="mb-3">Job Description</CardTitle>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {job.description}
        </p>
      </Card>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <Card>
          <CardTitle className="mb-3">Required Skills</CardTitle>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <Badge key={i} variant="violet">{skill}</Badge>
            ))}
          </div>
        </Card>
      )}

      {applyOpen && (
        <ApplicationModal jobId={job.id} onClose={() => setApplyOpen(false)} />
      )}
    </div>
  );
}
