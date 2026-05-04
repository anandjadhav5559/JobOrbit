package com.joborbit.feed.security;

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

        // Allow public/system endpoints
        if (path.startsWith("/actuator")
                || path.contains("/eureka")
                || path.startsWith("/error")
                || path.startsWith("/uploads")) {

            chain.doFilter(request, response);
            return;
        }

        String internalHeader = req.getHeader("X-Internal-Request");
        String userIdHeader = req.getHeader("X-User-Id");

        // Case 1: Gateway request (trusted)
        if ("true".equalsIgnoreCase(internalHeader)) {
            chain.doFilter(request, response);
            return;
        }

        // Case 2: Internal service call (Feign)
        // No internal header but still valid service-to-service
        if (internalHeader == null) {
            chain.doFilter(request, response);
            return;
        }

        // Case 3: Suspicious request
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");
        res.getWriter().write("{\"error\": \"Unauthorized: Access only via API Gateway\"}");
    }
}