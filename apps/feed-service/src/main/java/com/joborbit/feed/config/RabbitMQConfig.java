package com.joborbit.feed.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // CONSTANTS
    public static final String EXCHANGE = "joborbit.exchange";

    public static final String PROFILE_QUEUE = "profile.queue";
    public static final String PROFILE_KEY = "profile.updated";

    // EXCHANGE
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    // QUEUE
    @Bean
    public Queue profileQueue() {
        return new Queue(PROFILE_QUEUE, true); // durable
    }

    // BINDING 
    @Bean
    public Binding profileBinding() {
        return BindingBuilder.bind(profileQueue())
                .to(exchange())
                .with(PROFILE_KEY);
    }

    // JSON CONVERTER 
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // TEMPLATE 
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}