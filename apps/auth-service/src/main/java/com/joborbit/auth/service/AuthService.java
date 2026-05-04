package com.joborbit.auth.service;

import com.joborbit.auth.dto.*;

public interface AuthService {

   
    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse verifyOtp(VerifyOtpRequest request);

    String resendOtp(ResendOtpRequest request);

    String forgetPassword(ForgetPasswordRequest request);

    String resetPassword(ResetPasswordRequest request);

    LoginResponse refresh(RefreshRequest request);
}