package com.joborbit.job.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joborbit.job.dto.CreateJobRequest;
import com.joborbit.job.dto.JobResponse;
import com.joborbit.job.dto.UpdateJobRequest;
import com.joborbit.job.entity.Company;
import com.joborbit.job.entity.Job;
import com.joborbit.job.entity.Status;
import com.joborbit.job.exception.BadRequestException;
import com.joborbit.job.exception.ResourceNotFoundException;
import com.joborbit.job.exception.UnauthorizedException;
import com.joborbit.job.repository.CompanyRepository;
import com.joborbit.job.repository.JobRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    // CREATE 
    @Override
    public JobResponse createJob(CreateJobRequest request, Long userId) {

        // Validate company exists
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        // IMPORTANT: Verify company
        if (!company.isVerified()) {
            throw new BadRequestException("Company is not verified. Cannot post jobs.");
        }

        // ownership check (IMPORTANT)
        if (!company.getCreatedBy().equals(userId)) {
            throw new UnauthorizedException("You are not owner of this company");
        }

        // Create job
        Job job = Job.builder()
                .recruiterId(userId)
                .companyId(request.getCompanyId())
                .jobTitle(request.getJobTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .responsibilities(request.getResponsibilities())
                .employmentType(request.getEmploymentType())
                .experienceLevel(request.getExperienceLevel())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation())
                .isRemote(request.getIsRemote())
                .skillsRequired(request.getSkillsRequired())
                .status(Status.ACTIVE)
                .expiresAt(request.getExpiresAt())
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        Job saved = jobRepository.save(job);

        return mapToResponse(saved);
    }

    // GET 
    @Override
    public List<JobResponse> getAllJobs(String status, String location, String employmentType, String experienceLevel) {

        return jobRepository.findAll()
                .stream()
                .filter(j -> status == null || j.getStatus().name().equalsIgnoreCase(status))
                .filter(j -> location == null || j.getLocation().equalsIgnoreCase(location))
                .filter(j -> employmentType == null || j.getEmploymentType().equalsIgnoreCase(employmentType))
                .filter(j -> experienceLevel == null || j.getExperienceLevel().equalsIgnoreCase(experienceLevel))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobResponse getJobById(Long jobId) {
        return mapToResponse(
                jobRepository.findById(jobId)
                        .orElseThrow(() -> new ResourceNotFoundException("Job not found"))
        );
    }

    @Override
    public List<JobResponse> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobResponse> searchJobs(String keyword1, String keyword2) {
        return jobRepository
                .findByJobTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword1, keyword2)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // UPDATE 
    @Override
    public JobResponse updateJob(Long jobId, UpdateJobRequest request, Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Ownership check
        if (!job.getRecruiterId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized: You can only update your own job");
        }

        if (request.getJobTitle() != null) job.setJobTitle(request.getJobTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getResponsibilities() != null) job.setResponsibilities(request.getResponsibilities());
        if (request.getEmploymentType() != null) job.setEmploymentType(request.getEmploymentType());
        if (request.getExperienceLevel() != null) job.setExperienceLevel(request.getExperienceLevel());
        if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getIsRemote() != null) job.setIsRemote(request.getIsRemote());
        if (request.getSkillsRequired() != null) job.setSkillsRequired(request.getSkillsRequired());
        if (request.getStatus() != null) job.setStatus(request.getStatus());
        if (request.getExpiresAt() != null) job.setExpiresAt(request.getExpiresAt());

        return mapToResponse(jobRepository.save(job));
    }

    // DELETE 
    @Override
    public void deleteJob(Long jobId) {

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found");
        }

        jobRepository.deleteById(jobId);
    }

    // CLOSE 
    @Override
    public JobResponse closeJob(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        job.setStatus(Status.CLOSED);

        return mapToResponse(jobRepository.save(job));
    }

    // MAPPER 
    private JobResponse mapToResponse(Job job) {

        JobResponse response = new JobResponse();

        response.setJobId(job.getJobId());
        response.setRecruiterId(job.getRecruiterId());
        response.setCompanyId(job.getCompanyId());
        response.setJobTitle(job.getJobTitle());
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        response.setResponsibilities(job.getResponsibilities());
        response.setEmploymentType(job.getEmploymentType());
        response.setExperienceLevel(job.getExperienceLevel());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setLocation(job.getLocation());
        response.setIsRemote(job.getIsRemote());
        response.setSkillsRequired(job.getSkillsRequired());
        response.setStatus(job.getStatus());
        response.setExpiresAt(job.getExpiresAt());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());

        companyRepository.findById(job.getCompanyId())
                .ifPresent(company -> {
                    response.setCompanyName(company.getName());
                    response.setCompanyLogoUrl(company.getLogoUrl());
                });

        return response;
    }
}