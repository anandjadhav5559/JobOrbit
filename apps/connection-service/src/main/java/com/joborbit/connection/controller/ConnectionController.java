package com.joborbit.connection.controller;

import com.joborbit.connection.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ConnectionController {

    private final ConnectionService service;

    // SEND
    @PostMapping("/request/{receiverId}")
    public String sendRequest(
            @PathVariable Long receiverId,
            @RequestHeader("X-User-Id") Long userId) {

        service.sendRequest(userId, receiverId);
        return "Request sent";
    }

    // ACCEPT 
    @PostMapping("/accept/{senderId}")
    public String acceptRequest(
            @PathVariable Long senderId,
            @RequestHeader("X-User-Id") Long userId) {

        service.acceptRequest(senderId, userId);
        return "Connection accepted";
    }

    // REJECT 
    @PostMapping("/reject/{senderId}")
    public String rejectRequest(
            @PathVariable Long senderId,
            @RequestHeader("X-User-Id") Long userId) {

        service.rejectRequest(senderId, userId);
        return "Connection rejected";
    }

    // GET MY CONNECTIONS 
    @GetMapping
    public List<Long> getMyConnections(
            @RequestHeader("X-User-Id") Long userId) {

        return service.getConnections(userId);
    }

    // CHECK 
    @GetMapping("/check/{otherUserId}")
    public boolean checkConnection(
            @PathVariable Long otherUserId,
            @RequestHeader("X-User-Id") Long userId) {

        return service.checkConnection(userId, otherUserId);
    }
}