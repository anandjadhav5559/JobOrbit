package com.joborbit.chat.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final PresenceService presenceService;

    public WebSocketEventListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void handleConnect(SessionConnectEvent event) {
        String userId = extractUserId(event);
        if (userId != null) {
            presenceService.setUserOnline(userId);
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String userId = extractUserId(event);
        if (userId != null) {
            presenceService.setUserOffline(userId);
        }
    }

    private String extractUserId(AbstractSubProtocolEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        if (accessor.getSessionAttributes() != null) {
            return (String) accessor.getSessionAttributes().get("userId");
        }

        return null;
    }
}