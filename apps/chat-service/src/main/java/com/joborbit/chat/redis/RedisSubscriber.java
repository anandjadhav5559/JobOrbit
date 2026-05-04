package com.joborbit.chat.redis;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.joborbit.chat.dto.ChatMessageDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class RedisSubscriber {

    private final SimpMessagingTemplate messagingTemplate;


    public void receiveMessage(ChatMessageDTO message) {

        // Send to specific user topic
        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getReceiverId(),
                message
        );
    }
}