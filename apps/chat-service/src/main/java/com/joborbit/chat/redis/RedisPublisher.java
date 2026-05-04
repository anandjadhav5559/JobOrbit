package com.joborbit.chat.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.joborbit.chat.dto.ChatMessageDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisPublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CHANNEL = "chat-channel";


    public void publish(ChatMessageDTO message) {
        redisTemplate.convertAndSend(CHANNEL, message);
    }
}