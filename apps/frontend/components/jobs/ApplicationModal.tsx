"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/jobService";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ApplicationModalProps {
  jobId: number;
  onClose: () => void;
}

export default function ApplicationModal({ jobId, onClose }: ApplicationModalProps) {
  const queryClient = useQueryClient();
  const [coverLetter, setCoverLetter] = useState("");
  const [success, setSuccess] = useState(false);

  const applyMutation = useMutation({
    mutationFn: () => applicationService.applyForJob({ jobId, coverLetter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSuccess(true);
      setTimeout(onClose, 2000);
    },
  });

  return (
    <Modal isOpen title="Apply for this Job" onClose={onClose} size="md">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Application Submitted!</h3>
          <p className="text-sm text-text-muted mt-2">Good luck with your application!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary block mb-2">
              Cover Letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Tell the recruiter why you're a great fit for this role..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
            />
          </div>

          {applyMutation.isError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              Failed to submit application. Please try again.
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              fullWidth
              loading={applyMutation.isPending}
              onClick={() => applyMutation.mutate()}
            >
              Submit Application
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
