package com.joborbit.feed.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.joborbit.feed.config.RabbitMQConfig;
import com.joborbit.feed.event.ProfileEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileEventListener {

   
    private final RedisTemplate<String, Object> redisTemplate;

    @RabbitListener(queues = RabbitMQConfig.PROFILE_QUEUE)
    public void handleProfileUpdate(ProfileEvent event) {

        log.info("Received profile update for userId: {}", event.getUserId());

        if (event == null || event.getUserId() == null) {
            log.warn("Invalid profile event received");
            return;
        }

        try {
            // ONLY cache invalidation
            redisTemplate.delete("feed::" + event.getUserId());

            log.info("Cache cleared after profile update");

        } catch (Exception e) {
            log.error("Error processing profile event: {}", e.getMessage(), e);
        }
    }
}