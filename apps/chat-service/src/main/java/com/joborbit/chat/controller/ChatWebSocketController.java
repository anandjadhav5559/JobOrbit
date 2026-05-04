package com.joborbit.chat.controller;

import com.joborbit.chat.dto.ChatMessageDTO;
import com.joborbit.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO dto,
                            SimpMessageHeaderAccessor headerAccessor) {

        String senderId = (String) headerAccessor
                .getSessionAttributes()
                .get("userId");

        if (senderId == null) {
            throw new RuntimeException("Unauthorized: userId missing");
        }

        dto.setSenderId(senderId);

        chatService.sendMessage(dto);
    }
}