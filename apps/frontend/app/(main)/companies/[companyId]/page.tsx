"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService, jobService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { Job } from "@/types";
import { Building2, MapPin, Globe, ChevronLeft, Briefcase, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import ApplicationModal from "@/components/jobs/ApplicationModal";
import { useState } from "react";

interface CompanyDetailPageProps {
  params: { companyId: string };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const companyId = parseInt(params.companyId);
  const router = useRouter();
  const { user } = useAuthStore();
  const [applyJobId, setApplyJobId] = useState<number | null>(null);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyService.getCompanyById(companyId),
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["company-jobs", companyId],
    queryFn: () => companyService.getJobsByCompany(companyId),
  });

  if (companyLoading) return <PageSpinner />;
  if (!company) return <div className="text-center py-20 text-text-muted">Company not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Header */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-bg-elevated flex items-center justify-center shrink-0">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Building2 size={32} className="text-text-muted" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold text-text-primary">{company.name}</h1>
              {/* Edit button — visible to owner or admin */}
              {(company.ownerId === user?.userId || user?.role === "ADMIN") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/companies/${companyId}/edit`)}
                >
                  <Edit3 size={13} />
                  Edit
                </Button>
              )}
            </div>
            {company.industry && (
              <Badge variant="violet" className="mt-1">{company.industry}</Badge>
            )}
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-text-muted">
              {company.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {company.location}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan hover:text-cyan-light transition-colors"
                >
                  <Globe size={14} />
                  {company.website}
                </a>
              )}
            </div>
          </div>
        </div>
        {company.description && (
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            {company.description}
          </p>
        )}
      </Card>

      {/* Jobs */}
      <Card>
        <CardTitle className="mb-4 flex items-center gap-2">
          <Briefcase size={18} className="text-violet" />
          Open Positions ({jobs?.length || 0})
        </CardTitle>
        {jobsLoading ? (
          <p className="text-sm text-text-muted">Loading jobs...</p>
        ) : !jobs || jobs.length === 0 ? (
          <p className="text-sm text-text-muted">No open positions at this time.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job: Job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border hover:border-violet/50 transition-colors"
              >
                <div>
                  <button
                    onClick={() => router.push(ROUTES.JOB_DETAIL(job.id))}
                    className="font-medium text-text-primary text-sm hover:text-violet transition-colors"
                  >
                    {job.title}
                  </button>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                    <MapPin size={11} />
                    {job.location}
                    <span>·</span>
                    <span>{job.employmentType?.replace("_", " ")}</span>
                  </div>
                </div>
                {user?.role === "CANDIDATE" && job.status === "OPEN" && (
                  <Button size="sm" onClick={() => setApplyJobId(job.id)}>
                    Apply
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {applyJobId && (
        <ApplicationModal jobId={applyJobId} onClose={() => setApplyJobId(null)} />
      )}
    </div>
  );
}
