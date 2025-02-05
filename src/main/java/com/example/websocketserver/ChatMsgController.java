package com.example.websocketserver;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatMsgController {

    @MessageMapping("/chat")
    @SendTo("/topic/chat-msgs")
    public ChatMessage chat(ChatMessage message) {
        return message;
    }

}


