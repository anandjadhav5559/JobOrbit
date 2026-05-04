package com.joborbit.auth.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String email, String name, String otp) {

        String displayName = (name != null && !name.isBlank()) ? name : "User";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("JobOrbit - OTP Verification");

        message.setText(
                "Hello " + displayName + ",\n\n" +
                "Thank you for using JobOrbit.\n\n" +
                "Your One-Time Password (OTP) for verification is:\n\n" +
                otp + "\n\n" +
                "This OTP is valid for the next 15 minutes. Please do not share it with anyone for security reasons.\n\n" +
                "If you did not request this OTP, please ignore this email.\n\n" +
                "Best regards,\n" +
                "JobOrbit Team"
        );

        mailSender.send(message);
    }
    public void sendResetLink(String email,String name, String resetLink) {
    	
    	String displayName = (name != null && !name.isBlank()) ? name : "User";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Your JobOrbit Password");

        message.setText(
        		"Hello " + displayName + ",\n\n" +
                "We received a request to reset your password for your JobOrbit account.\n\n" +
                "You can reset your password by clicking the link below:\n\n" +
                resetLink + "\n\n" +
                "This link will expire in 15 minutes for security reasons.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Thanks & Regards,\n" +
                "JobOrbit Team"
        );

        mailSender.send(message);
    }
}