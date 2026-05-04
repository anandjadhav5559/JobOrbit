package com.joborbit.chat.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.joborbit.chat.dto.ChatMessageDTO;
import com.joborbit.chat.entity.ChatMessage;
import com.joborbit.chat.kafka.ChatEvent;
import com.joborbit.chat.kafka.ChatEventProducer;
import com.joborbit.chat.mapper.ChatMapper;
import com.joborbit.chat.redis.RedisPublisher;
import com.joborbit.chat.repository.ChatRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final RedisPublisher redisPublisher;
    private final ChatEventProducer chatEventProducer;


    // CORE METHOD
    @Override
    public void sendMessage(ChatMessageDTO dto) {

        // Set timestamp
        dto.setTimestamp(LocalDateTime.now());

        // Convert to entity
        ChatMessage entity = ChatMapper.toEntity(dto);

        // Save to DB
        ChatMessage saved = chatRepository.save(entity);

        // Convert back to DTO (clean data)
        ChatMessageDTO savedDTO = ChatMapper.toDTO(saved);

        // Send real-time via Redis
        redisPublisher.publish(savedDTO);

        // Send event to Kafka (notifications)
        ChatEvent event = new ChatEvent(
                savedDTO.getSenderId(),
                savedDTO.getReceiverId(),
                savedDTO.getContent(),
                savedDTO.getTimestamp()
        );

        chatEventProducer.sendChatEvent(event);
    }

    // Get conversation
    @Override
    public List<ChatMessageDTO> getConversation(String user1, String user2) {

        return chatRepository.getConversation(user1, user2)
                .stream()
                .map(ChatMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Unread messages
    @Override
    public List<ChatMessageDTO> getUnreadMessages(String userId) {

        return chatRepository.findByReceiverIdAndIsReadFalse(userId)
                .stream()
                .map(ChatMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Mark as read
    @Override
    public void markMessagesAsRead(String senderId, String receiverId) {
        chatRepository.markAsRead(receiverId, senderId);
    }
}