"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/jobService";
import { Job } from "@/types";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import { MapPin, Clock, Search, Briefcase, Building2, DollarSign, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";
import ApplicationModal from "@/components/jobs/ApplicationModal";

const statusVariantMap: Record<string, "success" | "danger" | "muted"> = {
  OPEN: "success",
  CLOSED: "danger",
  DRAFT: "muted",
};

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    location: "",
    employmentType: "",
    experienceLevel: "",
    status: "OPEN",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [applyJobId, setApplyJobId] = useState<number | null>(null);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () =>
      jobService.getAllJobs({
        status: filters.status || undefined,
        location: filters.location || undefined,
        employmentType: filters.employmentType || undefined,
        experienceLevel: filters.experienceLevel || undefined,
      }),
  });

  const filteredJobs = (jobs || []).filter((j: Job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.companyName?.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Browse Jobs
          {user?.role === "RECRUITER" && (
            <span className="ml-3 text-sm text-text-muted font-normal">
              (Recruiter Mode)
            </span>
          )}
        </h1>
        {user?.role === "RECRUITER" && (
          <Button onClick={() => router.push("/jobs/create")}>
            <Briefcase size={14} />
            Post a Job
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div className="w-56 shrink-0 space-y-4">
          <Card padding="md">
            <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Filter size={14} className="text-violet" />
              Filters
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Employment Type</label>
                <select
                  value={filters.employmentType}
                  onChange={(e) => setFilters((f) => ({ ...f, employmentType: e.target.value }))}
                  className="mt-1 w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-violet"
                >
                  <option value="">All Types</option>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Experience</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters((f) => ({ ...f, experienceLevel: e.target.value }))}
                  className="mt-1 w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-violet"
                >
                  <option value="">All Levels</option>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Any location"
                  className="mt-1 w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                  className="mt-1 w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-violet"
                >
                  <option value="">All</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Job list */}
        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company..."
              className="w-full bg-bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet transition-all"
            />
          </div>

          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)}

          {filteredJobs.map((job: Job) => (
            <Card key={job.id} hover padding="md" className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-violet/10 transition-colors">
                  <Building2 size={22} className="text-text-muted" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => router.push(ROUTES.JOB_DETAIL(job.id))}
                        className="text-base font-semibold text-text-primary hover:text-violet transition-colors text-left"
                      >
                        {job.title}
                      </button>
                      <p className="text-sm text-text-secondary">
                        {job.companyName || "Company"}
                      </p>
                    </div>
                    <Badge variant={statusVariantMap[job.status] || "muted"} dot>
                      {job.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {job.employmentType?.replace("_", " ")}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        {job.salary}
                      </span>
                    )}
                    <span>{formatRelativeTime(job.createdAt)}</span>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.slice(0, 4).map((s, i) => (
                        <Badge key={i} variant="muted" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-xs text-text-muted">+{job.skills.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {user?.role === "CANDIDATE" && job.status === "OPEN" && (
                    <Button size="sm" onClick={() => setApplyJobId(job.id)}>
                      Apply Now
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(ROUTES.JOB_DETAIL(job.id))}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {!isLoading && filteredJobs.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply modal */}
      {applyJobId && (
        <ApplicationModal
          jobId={applyJobId}
          onClose={() => setApplyJobId(null)}
        />
      )}
    </div>
  );
}
