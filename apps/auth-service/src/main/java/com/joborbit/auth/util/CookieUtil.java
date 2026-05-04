package com.joborbit.auth.util;

import org.springframework.http.ResponseCookie;

public class CookieUtil {

    private static final long REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

    public static ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)          // prevents JS access
                .secure(true)           // true in production (HTTPS)
                .path("/")               // available for all endpoints
                .maxAge(REFRESH_TOKEN_EXPIRY)
                .sameSite("Lax")         // or "None" for cross-domain
                .build();
    }

    public static ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)               // delete cookie
                .sameSite("Lax")
                .build();
    }
}