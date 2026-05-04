package com.joborbit.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {

    private String senderId;
    private String receiverId;
    private String content;
    private LocalDateTime timestamp;
}