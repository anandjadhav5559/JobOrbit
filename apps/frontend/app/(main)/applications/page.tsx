"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { Application, UpdateStatusRequest } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { APPLICATION_STATUSES } from "@/utils/constants";
import { Briefcase, Calendar, Trash2 } from "lucide-react";

const statusVariant: Record<string, "muted" | "warning" | "cyan" | "danger" | "success"> = {
  PENDING: "warning",
  REVIEWED: "muted",
  SHORTLISTED: "cyan",
  REJECTED: "danger",
  ACCEPTED: "success",
};

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", user?.userId],
    queryFn: () => applicationService.getApplicationsByCandidate(user!.userId),
    enabled: !!user,
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: number) => applicationService.withdrawApplication(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      applicationService.updateApplicationStatus(id, { status } as UpdateStatusRequest),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        My Applications
        <span className="ml-2 text-sm font-normal text-text-muted">
          ({applications?.length || 0})
        </span>
      </h1>

      {(!applications || applications.length === 0) ? (
        <Card className="text-center py-16">
          <Briefcase size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No applications yet</h3>
          <p className="text-text-muted text-sm">Browse jobs and apply to get started!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app: Application) => (
            <Card key={app.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-text-primary">
                      {app.jobTitle || `Job #${app.jobId}`}
                    </h3>
                    <Badge variant={statusVariant[app.status] || "muted"} dot>
                      {app.status}
                    </Badge>
                  </div>
                  {app.companyName && (
                    <p className="text-sm text-text-secondary">{app.companyName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                    <Calendar size={12} />
                    Applied {formatDate(app.appliedAt)}
                  </div>
                  {app.coverLetter && (
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{app.coverLetter}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {/* Recruiter/Admin: update status */}
                  {(user?.role === "RECRUITER" || user?.role === "ADMIN") && (
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({ id: app.id, status: e.target.value })
                      }
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-violet"
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  )}

                  {/* Candidate: withdraw */}
                  {user?.role === "CANDIDATE" && app.status === "PENDING" && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={withdrawMutation.isPending}
                      onClick={() => withdrawMutation.mutate(app.id)}
                    >
                      <Trash2 size={12} />
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
