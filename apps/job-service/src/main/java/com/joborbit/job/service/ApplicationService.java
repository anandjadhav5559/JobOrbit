package com.joborbit.job.service;

import java.util.List;

import com.joborbit.job.dto.ApplicationResponse;
import com.joborbit.job.dto.CreateApplicationRequest;
import com.joborbit.job.dto.UpdateStatusRequest;

public interface ApplicationService {

    ApplicationResponse applyForJob(CreateApplicationRequest request, Long userId);

    List<ApplicationResponse> getApplicationsByJob(Long jobId);

    List<ApplicationResponse> getApplicationsByCandidate(Long candidateId);

    ApplicationResponse getApplicationById(Long id);

    ApplicationResponse updateApplicationStatus(Long id, UpdateStatusRequest request);

    void withdrawApplication(Long applicationId, Long userId);
}