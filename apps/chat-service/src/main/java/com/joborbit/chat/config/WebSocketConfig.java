package com.joborbit.chat.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.*;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final HeaderChannelInterceptor headerChannelInterceptor;

    // WebSocket Endpoint (Client connects here)
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")   // allowing frontend
                .withSockJS();                   // fallback support
    }

    // Message Routing Config
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // Messages sent to /app go to @MessageMapping
        registry.setApplicationDestinationPrefixes("/app");

        // Broker handles these destinations
        registry.enableSimpleBroker("/topic", "/queue");
    }

    // Interceptor (JWT → userId extraction)
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(headerChannelInterceptor);
    }
}