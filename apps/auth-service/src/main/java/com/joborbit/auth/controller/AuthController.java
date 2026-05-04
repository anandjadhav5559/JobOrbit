package com.joborbit.auth.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joborbit.auth.dto.ForgetPasswordRequest;
import com.joborbit.auth.dto.LoginRequest;
import com.joborbit.auth.dto.LoginResponse;
import com.joborbit.auth.dto.RefreshRequest;
import com.joborbit.auth.dto.RegisterRequest;
import com.joborbit.auth.dto.ResendOtpRequest;
import com.joborbit.auth.dto.ResetPasswordRequest;
import com.joborbit.auth.dto.VerifyOtpRequest;
import com.joborbit.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")   
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        // Create cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(true) // true in production (HTTPS)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        // Removing refreshToken from body 
        response.setRefreshToken(null);

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    // VERIFY OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    // RESEND OTP 
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(
            @RequestBody ResendOtpRequest request) {

        return ResponseEntity.ok(authService.resendOtp(request));
    }

    // FORGOT PASSWORD 
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgetPasswordRequest request) {

        return ResponseEntity.ok(authService.forgetPassword(request));
    }

    // RESET PASSWORD 
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(authService.resetPassword(request));
    }

    // REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        LoginResponse response = authService.refresh(
                new RefreshRequest(refreshToken)
        );

        return ResponseEntity.ok(response);
    }
}