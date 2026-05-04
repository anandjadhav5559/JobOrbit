package com.joborbit.auth.dto;

import com.joborbit.auth.entity.Role;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Role role;
}