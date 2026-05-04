package com.joborbit.chat.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joborbit.chat.dto.ChatMessageDTO;
import com.joborbit.chat.service.ChatService;
import com.joborbit.chat.websocket.PresenceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final PresenceService presenceService;

    // Get conversation 
    @GetMapping("/conversation/{otherUserId}")
    public List<ChatMessageDTO> getConversation(
            @PathVariable String otherUserId,
            @RequestHeader("X-User-Id") String currentUserId) {

        return chatService.getConversation(currentUserId, otherUserId);
    }

    // Get unread messages
    @GetMapping("/unread")
    public List<ChatMessageDTO> getUnreadMessages(
            @RequestHeader("X-User-Id") String userId) {

        return chatService.getUnreadMessages(userId);
    }

    // Mark messages as read
    @PutMapping("/read/{senderId}")
    public void markAsRead(
            @PathVariable String senderId,
            @RequestHeader("X-User-Id") String receiverId) {

        chatService.markMessagesAsRead(senderId, receiverId);
    }

    // Check online status
    @GetMapping("/status/{userId}")
    public boolean isOnline(@PathVariable String userId) {
        return presenceService.isUserOnline(userId);
    }
}