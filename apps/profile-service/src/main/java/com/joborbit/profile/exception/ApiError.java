package com.joborbit.profile.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiError {

    private int status;
    private String message;
    private String path;
    private LocalDateTime timestamp;
}