package com.joborbit.job.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "jobs")
@Data
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private Long recruiterId;
    private Long companyId;

    private String companyName;
    private String jobTitle;
    private String description;
    private String requirements;
    private String responsibilities;

    private String employmentType;
    private String experienceLevel;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    
    @Column(columnDefinition = "TEXT")
    private String skillsRequired;

  
    private LocalDateTime expiresAt;

    private String location;
    private Boolean isRemote;

    @Enumerated(EnumType.STRING)
    private Status status; 

    private String createdBy; // from gateway
    
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}