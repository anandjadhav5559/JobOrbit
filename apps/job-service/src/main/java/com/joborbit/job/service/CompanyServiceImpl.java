package com.joborbit.job.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joborbit.job.dto.*;
import com.joborbit.job.entity.*;
import com.joborbit.job.exception.*;
import com.joborbit.job.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    // CREATE 
    @Override
    public CompanyResponse createCompany(CreateCompanyRequest request, Long userId) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Company name is required");
        }

        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .industry(request.getIndustry())
                .size(request.getSize())
                .location(request.getLocation())
                .createdBy(userId)          // 🔥 IMPORTANT
                .isVerified(false)          // 🔥 default false
                .build();

        Company savedCompany = companyRepository.save(company);

        return convertToResponse(savedCompany);
    }

    // GET ALL 
    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID 
    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long companyId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        return convertToResponse(company);
    }

    // UPDATE 
    @Override
    public CompanyResponse updateCompany(Long companyId, UpdateCompanyRequest request, Long userId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        // Ownership check
        if (!company.getCreatedBy().equals(userId)) {
            throw new UnauthorizedException("You are not owner of this company");
        }

        if (request.getName() != null) company.setName(request.getName());
        if (request.getDescription() != null) company.setDescription(request.getDescription());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
        if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry());
        if (request.getSize() != null) company.setSize(request.getSize());
        if (request.getLocation() != null) company.setLocation(request.getLocation());

        Company updatedCompany = companyRepository.save(company);

        return convertToResponse(updatedCompany);
    }

    // DELETE 
    @Override
    public void deleteCompany(Long companyId, Long userId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        // Ownership OR Admin
        if (!company.getCreatedBy().equals(userId)) {
            throw new UnauthorizedException("You are not owner of this company");
        }

        companyRepository.delete(company);
    }

    // GET JOBS 
    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByCompany(Long companyId) {

        return jobRepository.findByCompanyId(companyId)
                .stream()
                .map(this::convertJobToResponse)
                .collect(Collectors.toList());
    }

    // MAPPER 
    private CompanyResponse convertToResponse(Company company) {

        CompanyResponse response = new CompanyResponse();

        response.setCompanyId(company.getCompanyId());
        response.setName(company.getName());
        response.setDescription(company.getDescription());
        response.setWebsite(company.getWebsite());
        response.setLogoUrl(company.getLogoUrl());
        response.setIndustry(company.getIndustry());
        response.setSize(company.getSize());
        response.setLocation(company.getLocation());
        response.setCreatedAt(company.getCreatedAt());
        response.setUpdatedAt(company.getUpdatedAt());

        
        response.setVerified(company.isVerified());

        return response;
    }

    private JobResponse convertJobToResponse(Job job) {

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

        Company company = companyRepository.findById(job.getCompanyId()).orElse(null);

        if (company != null) {
            response.setCompanyName(company.getName());
            response.setCompanyLogoUrl(company.getLogoUrl());
        }

        return response;
    }
}