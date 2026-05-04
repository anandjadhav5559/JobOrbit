package com.joborbit.chat.mapper;

import com.joborbit.chat.dto.ChatMessageDTO;
import com.joborbit.chat.entity.ChatMessage;

public class ChatMapper {

    public static ChatMessage toEntity(ChatMessageDTO dto) {
        return ChatMessage.builder()
                .senderId(dto.getSenderId())
                .receiverId(dto.getReceiverId())
                .content(dto.getContent())
                .timestamp(dto.getTimestamp())
                .isRead(false)
                .build();
    }

    public static ChatMessageDTO toDTO(ChatMessage entity) {
        return ChatMessageDTO.builder()
                .senderId(entity.getSenderId())
                .receiverId(entity.getReceiverId())
                .content(entity.getContent())
                .timestamp(entity.getTimestamp())
                .build();
    }
}