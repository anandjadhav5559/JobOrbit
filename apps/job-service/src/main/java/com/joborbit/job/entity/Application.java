package com.joborbit.job.entity;

import java.time.LocalDateTime;

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
import lombok.Setter;

@Entity
@Table(name = "applications")
@Data
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    private Long jobId;
    private Long candidateId;

    private String resumeUrl;
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; 
    
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}