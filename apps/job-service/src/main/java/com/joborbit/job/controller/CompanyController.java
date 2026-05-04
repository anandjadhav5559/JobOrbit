package com.joborbit.job.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.joborbit.job.dto.CompanyResponse;
import com.joborbit.job.dto.CreateCompanyRequest;
import com.joborbit.job.dto.JobResponse;
import com.joborbit.job.dto.UpdateCompanyRequest;
import com.joborbit.job.service.CompanyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // CREATE 
    @PostMapping("/createCompany")
    public ResponseEntity<CompanyResponse> createCompany(
            @RequestBody CreateCompanyRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"RECRUITER".equals(role)) {
            throw new RuntimeException("Only recruiter can create company");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(companyService.createCompany(request, userId));
    }

    // GET 
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getCompanyById(companyId));
    }

    // UPDATE 
    @PutMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long companyId,
            @RequestBody UpdateCompanyRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        // Admin OR Owner allowed
        if (!"ADMIN".equals(role) && !"RECRUITER".equals(role)) {
            throw new RuntimeException("Unauthorized");
        }

        return ResponseEntity.ok(
                companyService.updateCompany(companyId, request, userId)
        );
    }

    // DELETE 
    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable Long companyId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {

        // Admin OR Owner allowed
        if (!"ADMIN".equals(role) && !"RECRUITER".equals(role)) {
            throw new RuntimeException("Unauthorized");
        }

        companyService.deleteCompany(companyId, userId);

        return ResponseEntity.noContent().build();
    }

    // COMPANY JOBS
    @GetMapping("/{companyId}/jobs")
    public ResponseEntity<List<JobResponse>> getJobsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getJobsByCompany(companyId));
    }
}