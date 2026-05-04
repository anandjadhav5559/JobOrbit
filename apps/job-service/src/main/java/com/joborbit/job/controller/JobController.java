package com.joborbit.job.controller;

import com.joborbit.job.dto.*;
import com.joborbit.job.service.JobService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/create")
    public ResponseEntity<JobResponse> createJob(
            @RequestBody CreateJobRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"RECRUITER".equals(role)) {
            throw new RuntimeException("Only recruiters can create jobs");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(request, userId));
    }

    @GetMapping("/getall")
    public ResponseEntity<List<JobResponse>> getAllJobs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String experienceLevel
    ) {
        return ResponseEntity.ok(
                jobService.getAllJobs(status, location, employmentType, experienceLevel)
        );
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody UpdateJobRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(jobService.updateJob(jobId, request, userId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only admin can delete jobs");
        }

        jobService.deleteJob(jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobResponse>> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiterId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(
            @RequestParam String keyword1,
            @RequestParam String keyword2
    ) {
        return ResponseEntity.ok(jobService.searchJobs(keyword1, keyword2));
    }

    @PatchMapping("/{jobId}/close")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"RECRUITER".equals(role)) {
            throw new RuntimeException("Only recruiter can close job");
        }

        return ResponseEntity.ok(jobService.closeJob(jobId));
    }
}