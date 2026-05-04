package com.joborbit.chat.config;

import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class HeaderChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            // Header passed from frontend (or gateway)
            String userId = accessor.getFirstNativeHeader("X-User-Id");

            if (userId != null) {
                accessor.getSessionAttributes().put("userId", userId);
            }
        }

        return message;
    }
}