package com.joborbit.chat.kafka;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatEvent {

    private String senderId;
    private String receiverId;
    private String content;
    private LocalDateTime timestamp;

}