package com.joborbit.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joborbit.auth.dto.ForgetPasswordRequest;
import com.joborbit.auth.dto.LoginRequest;
import com.joborbit.auth.dto.LoginResponse;
import com.joborbit.auth.dto.RefreshRequest;
import com.joborbit.auth.dto.RegisterRequest;
import com.joborbit.auth.dto.ResendOtpRequest;
import com.joborbit.auth.dto.ResetPasswordRequest;
import com.joborbit.auth.dto.VerifyOtpRequest;
import com.joborbit.auth.entity.RefreshToken;
import com.joborbit.auth.entity.Role;
import com.joborbit.auth.entity.User;
import com.joborbit.auth.exception.BadRequestException;
import com.joborbit.auth.exception.ResourceNotFoundException;
import com.joborbit.auth.exception.UnauthorizedException;
import com.joborbit.auth.repository.UserRepository;
import com.joborbit.auth.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;

    // REGISTER 
    @Override
    public String register(RegisterRequest request) {

        Role role;

        // Default role
        if (request.getRole() == null) {
            role = Role.CANDIDATE;
        } 
        // Allowing recruiter
        else if (request.getRole() == Role.RECRUITER) {
            role = Role.RECRUITER;
        } 
        // Blocking admin creation
        else {
            throw new BadRequestException("Invalid role selection");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(role)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    //LOGIN 
    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Access Token
        String accessToken = jwtUtil.generateToken(
                user.getId(),
                user.getRole().name()
        );

        // Refresh Token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .role(user.getRole().name())
                .build();
    }

    // VERIFY OTP
    @Override
    public LoginResponse verifyOtp(VerifyOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Already verified");
        }

        if (!request.getOtp().equals(user.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpAttempts(0);

        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateToken(
                user.getId(),
                user.getRole().name()
        );

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .role(user.getRole().name())
                .build();
    }

    // REFRESH TOKEN 
    @Override
    public LoginResponse refresh(RefreshRequest request) {

        // Validate refresh token
        RefreshToken refreshToken = refreshTokenService.verifyToken(request.getRefreshToken());

        // Get user
        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // New access token
        String accessToken = jwtUtil.generateToken(
                user.getId(),
                user.getRole().name()
        );

        // rotate refresh token 
        RefreshToken newToken = refreshTokenService.createRefreshToken(user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newToken.getToken())
                .role(user.getRole().name())
                .build();
    }

    // FORGET PASSWORD
    @Override
    public String forgetPassword(ForgetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generating random token (NOT JWT)
        String token = UUID.randomUUID().toString();

        // Save token in DB with expiry
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        // Create reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        // Send email
        emailService.sendResetLink(user.getEmail(),user.getName(), resetLink);

        return "Reset link sent";
    }
    // RESET PASSWORD 
    @Override
    public String resetPassword(ResetPasswordRequest request) {

        // Finding user by token
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // Checking expiry
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        // Updating password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Invalidating token 
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return "Password reset successful";
    }

    // RESEND OTP
    @Override
    public String resendOtp(ResendOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Already verified");
        }

        sendOtp(user);

        return "OTP resent";
    }

    // HELPER 
    private void sendOtp(User user) {

        if (user.getOtpAttempts() >= 5) {
            throw new BadRequestException("Max OTP attempts reached");
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        user.setOtp(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setOtpAttempts(user.getOtpAttempts() + 1);

        userRepository.save(user);

        emailService.sendOtp(user.getEmail(),user.getName(), otp);
    }
}