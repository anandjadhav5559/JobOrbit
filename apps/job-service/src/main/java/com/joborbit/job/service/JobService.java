package com.joborbit.job.service;

import java.util.List;

import com.joborbit.job.dto.CreateJobRequest;
import com.joborbit.job.dto.JobResponse;
import com.joborbit.job.dto.UpdateJobRequest;

public interface JobService {

    JobResponse createJob(CreateJobRequest request, Long recruiterId);

    List<JobResponse> getAllJobs(
            String status,
            String location,
            String employmentType,
            String experienceLevel
    );

    JobResponse getJobById(Long jobId);

    List<JobResponse> getJobsByRecruiter(Long recruiterId);

    List<JobResponse> searchJobs(String keyword1, String keyword2);

    JobResponse updateJob(Long jobId, UpdateJobRequest request, Long userId);

    JobResponse closeJob(Long jobId);

    void deleteJob(Long jobId);
}