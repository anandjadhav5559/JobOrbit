package com.joborbit.job.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.joborbit.job.entity.Status;

import lombok.Data;

@Data
public class UpdateJobRequest {
    private String jobTitle;
    private String description;
    private String requirements;
    private String responsibilities;
    private String employmentType;
    private String experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private Boolean isRemote;
    private String skillsRequired;
    private Status status;
    private LocalDateTime expiresAt;
}