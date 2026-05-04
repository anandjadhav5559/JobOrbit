package com.joborbit.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.joborbit.auth.entity.RefreshToken;
import com.joborbit.auth.exception.UnauthorizedException;
import com.joborbit.auth.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repo;

    // Create refresh token
    public RefreshToken createRefreshToken(Long userId) {

        // remove old tokens
        repo.deleteByUserId(userId);

        RefreshToken token = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        return repo.save(token);
    }

    // Validate token
    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = repo.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token expired");
        }

        return refreshToken;
    }
}