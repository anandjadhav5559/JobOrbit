package com.joborbit.job.dto;

import com.joborbit.job.entity.ApplicationStatus;

import lombok.Data;

@Data
public class UpdateStatusRequest {
	private ApplicationStatus status;
}