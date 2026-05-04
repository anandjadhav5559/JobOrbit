package com.joborbit.feed.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "connection-service")
public interface ConnectionClient {

    // Get current user's connections
    @GetMapping("/api/connections")
    List<Long> getConnections(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Internal-Request") String internal
    );

    // Check connection with another user
    @GetMapping("/api/connections/check/{otherUserId}")
    boolean checkConnection(
            @PathVariable Long otherUserId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Internal-Request") String internal
    );
}