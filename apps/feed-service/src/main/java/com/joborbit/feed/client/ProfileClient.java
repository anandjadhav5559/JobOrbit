package com.joborbit.feed.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "profile-service")
public interface ProfileClient {

    @GetMapping("/api/profiles/connections")
    List<Long> getConnections(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Internal-Request") String internal
    );
}