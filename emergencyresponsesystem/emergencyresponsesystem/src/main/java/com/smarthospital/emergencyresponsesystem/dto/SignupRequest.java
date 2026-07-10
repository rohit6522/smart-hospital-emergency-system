package com.smarthospital.emergencyresponsesystem.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String fullName;
    private String role; // "ADMIN" or "PUBLIC"
}