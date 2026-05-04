package com.joborbit.chat.config;

import com.joborbit.chat.security.HeaderAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final HeaderAuthenticationFilter headerFilter;

    public SecurityConfig(HeaderAuthenticationFilter headerFilter) {
        this.headerFilter = headerFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws-chat/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(headerFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}