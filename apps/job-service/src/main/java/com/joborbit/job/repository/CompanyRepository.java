package com.joborbit.job.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joborbit.job.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
	List<Company> findByCompanyId(Long companyId);
}