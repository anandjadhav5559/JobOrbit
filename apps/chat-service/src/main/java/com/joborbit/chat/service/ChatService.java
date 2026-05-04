package com.joborbit.chat.service;

import java.util.List;

import com.joborbit.chat.dto.ChatMessageDTO;

public interface ChatService {

    // Send message
    void sendMessage(ChatMessageDTO messageDTO);

    // Get conversation between two users
    List<ChatMessageDTO> getConversation(String user1, String user2);

    // Get unread messages
    List<ChatMessageDTO> getUnreadMessages(String userId);

    // Mark messages as read
    void markMessagesAsRead(String senderId, String receiverId);
}