package com.joborbit.chat.websocket;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class PresenceService {

    private final RedisTemplate<String, Object> redisTemplate;

    public PresenceService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setUserOnline(String userId) {
        redisTemplate.opsForValue()
                .set("user:online:" + userId, "true", Duration.ofMinutes(5));
    }

    public void setUserOffline(String userId) {
        redisTemplate.delete("user:online:" + userId);
    }

    public boolean isUserOnline(String userId) {
        return redisTemplate.hasKey("user:online:" + userId);
    }
}