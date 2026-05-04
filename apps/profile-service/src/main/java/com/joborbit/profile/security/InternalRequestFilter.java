package com.joborbit.profile.security;

import jakarta.servlet.*;
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

        // Allow system/public endpoints
        if (path.startsWith("/actuator")
                || path.contains("/eureka")
                || path.startsWith("/error")) {

            chain.doFilter(request, response);
            return;
        }

        // Check gateway header
        String internal = req.getHeader("X-Internal-Request");

        if (!"true".equalsIgnoreCase(internal)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write(
                "{\"error\": \"Unauthorized: Access only via API Gateway\"}"
            );
            return;
        }

        chain.doFilter(request, response);
    }
}