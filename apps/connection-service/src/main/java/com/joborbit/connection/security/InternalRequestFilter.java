package com.joborbit.connection.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class InternalRequestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI();

        // Allow public/system endpoints
        if (isPublicPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        String internal = req.getHeader("X-Internal-Request");

        // Validate internal request
        if (!"true".equalsIgnoreCase(internal)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\": \"Unauthorized: Access only via API Gateway\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    // Public endpoints
    private boolean isPublicPath(String path) {
        return path.startsWith("/actuator")
                || path.contains("/eureka")
                || path.startsWith("/error"); // Spring default
    }
}