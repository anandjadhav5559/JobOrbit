package com.joborbit.job.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joborbit.job.dto.*;
import com.joborbit.job.entity.*;
import com.joborbit.job.exception.BadRequestException;
import com.joborbit.job.exception.ResourceNotFoundException;
import com.joborbit.job.exception.UnauthorizedException;
import com.joborbit.job.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    // APPLY 
    @Override
    public ApplicationResponse applyForJob(CreateApplicationRequest request, Long userId) {

        // Validate request
        if (request.getJobId() == null) {
            throw new BadRequestException("JobId is required");
        }

        // Check job exists
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Prevent duplicate apply
        applicationRepository.findByJobIdAndCandidateId(request.getJobId(), userId)
                .ifPresent(a -> {
                    throw new BadRequestException("Already applied for this job");
                });

        // Build application
        Application application = Application.builder()
                .jobId(request.getJobId())
                .candidateId(userId)
                .resumeUrl(request.getResumeUrl())
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Application saved = applicationRepository.save(application);

        return mapToResponse(saved, job);
    }

    // GET BY JOB 
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(app -> mapToResponse(app, null))
                .collect(Collectors.toList());
    }

    // GET BY CANDIDATE 
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByCandidate(Long candidateId) {

        return applicationRepository.findByCandidateId(candidateId)
                .stream()
                .map(app -> mapToResponse(app, null))
                .collect(Collectors.toList());
    }

    // GET BY ID 
    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return mapToResponse(application, null);
    }

    // UPDATE STATUS 
    @Override
    public ApplicationResponse updateApplicationStatus(Long id, UpdateStatusRequest request) {

        if (request.getStatus() == null) {
            throw new BadRequestException("Status cannot be null");
        }

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setStatus(request.getStatus());
        application.setUpdatedAt(LocalDateTime.now()); 

        Application updated = applicationRepository.save(application);

        return mapToResponse(updated, null);
    }

    // DELETE 
    @Override
    public void withdrawApplication(Long applicationId, Long userId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // Ownership check
        if (!application.getCandidateId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized: Cannot delete others' application");
        }

        applicationRepository.delete(application);
    }

    // MAPPER 
    private ApplicationResponse mapToResponse(Application application, Job job) {

        ApplicationResponse response = new ApplicationResponse();

        response.setApplicationId(application.getApplicationId());
        response.setJobId(application.getJobId());
        response.setCandidateId(application.getCandidateId());
        response.setResumeUrl(application.getResumeUrl());
        response.setCoverLetter(application.getCoverLetter());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        response.setUpdatedAt(application.getUpdatedAt());

        // Job title
        if (job != null) {
            response.setJobTitle(job.getJobTitle());
        } else {
            jobRepository.findById(application.getJobId())
                    .ifPresent(j -> response.setJobTitle(j.getJobTitle()));
        }

        // Placeholder 
        response.setCandidateEmail("from-gateway");
        response.setCandidateName("N/A");

        return response;
    }
}