package com.joborbit.job.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.joborbit.job.dto.ApplicationResponse;
import com.joborbit.job.dto.CreateApplicationRequest;
import com.joborbit.job.dto.UpdateStatusRequest;
import com.joborbit.job.service.ApplicationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // APPLY
    @PostMapping
    public ResponseEntity<ApplicationResponse> applyForJob(
            @RequestBody CreateApplicationRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"CANDIDATE".equals(role)) {
            throw new RuntimeException("Only candidates can apply");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyForJob(request, userId));
    }

    // GET BY JOB
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJob(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"RECRUITER".equals(role) && !"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }

        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    // GET BY CANDIDATE
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidate(
            @PathVariable Long candidateId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!userId.equals(candidateId) && !"ADMIN".equals(role)) {
            throw new RuntimeException("Unauthorized access");
        }

        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(candidateId));
    }

    // UPDATE STATUS
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateStatusRequest request,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"RECRUITER".equals(role) && !"ADMIN".equals(role)) {
            throw new RuntimeException("Only recruiter/admin can update");
        }

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(applicationId, request)
        );
    }

    // DELETE
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> withdrawApplication(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"CANDIDATE".equals(role) && !"ADMIN".equals(role)) {
            throw new RuntimeException("Unauthorized");
        }

        applicationService.withdrawApplication(applicationId, userId);
        return ResponseEntity.noContent().build();
    }
}