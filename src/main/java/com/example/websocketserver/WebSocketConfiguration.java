package com.example.websocketserver;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*"); // Allow all origins;
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(4 * 8192);
        registry.setTimeToFirstMessage(10000);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // STOMP messages whose destination header begins with /app are routed to
        // @MessageMapping methods in @Controller classes
        config.setApplicationDestinationPrefixes("/app");
        // Use the built-in message broker for subscriptions and broadcasting and
        // route messages whose destination header begins with /topic or /queue to the broker
        config.enableSimpleBroker("/topic", "/queue");
    }
}