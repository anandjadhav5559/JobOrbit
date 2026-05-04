package com.joborbit.job.service;

import java.util.List;

import com.joborbit.job.dto.CompanyResponse;
import com.joborbit.job.dto.CreateCompanyRequest;
import com.joborbit.job.dto.JobResponse;
import com.joborbit.job.dto.UpdateCompanyRequest;

public interface CompanyService {


	CompanyResponse updateCompany(Long id, UpdateCompanyRequest request, Long userId);

	void deleteCompany(Long id, Long userId);
	
	CompanyResponse createCompany(CreateCompanyRequest request, Long userId);

    List<CompanyResponse> getAllCompanies();

    CompanyResponse getCompanyById(Long id);


    List<JobResponse> getJobsByCompany(Long companyId); 
}