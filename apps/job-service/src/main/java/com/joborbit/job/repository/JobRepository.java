package com.joborbit.job.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joborbit.job.entity.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterId(Long recruiterId);
    
    List<Job> findByCompanyId(Long companyId);

    List<Job> findByJobTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String keyword1,
            String keyword2
    );
}