package com.joborbit.chat.repository;

import com.joborbit.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

    // Get full conversation (both directions, ordered)
    @Query("""
        SELECT m FROM ChatMessage m
        WHERE (m.senderId = :user1 AND m.receiverId = :user2)
           OR (m.senderId = :user2 AND m.receiverId = :user1)
        ORDER BY m.timestamp ASC
    """)
    List<ChatMessage> getConversation(
            @Param("user1") String user1,
            @Param("user2") String user2
    );

    // Get all messages received by a user
    List<ChatMessage> findByReceiverId(String receiverId);

    // Get unread messages
    List<ChatMessage> findByReceiverIdAndIsReadFalse(String receiverId);

    // Mark messages as read
    @Transactional
    @Modifying
    @Query("""
        UPDATE ChatMessage m
        SET m.isRead = true
        WHERE m.receiverId = :receiverId
          AND m.senderId = :senderId
    """)
    void markAsRead(
            @Param("receiverId") String receiverId,
            @Param("senderId") String senderId
    );
}