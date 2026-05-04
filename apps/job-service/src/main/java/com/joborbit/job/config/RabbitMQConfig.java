package com.joborbit.job.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // EXCHANGE 
    public static final String EXCHANGE = "joborbit.exchange";

    // PROFILE 
    public static final String PROFILE_QUEUE = "profile.queue";
    public static final String PROFILE_KEY = "profile.updated";

    // JOB 
    public static final String JOB_QUEUE = "job.queue";
    public static final String JOB_KEY = "job.created";

    // CONNECTION 
    public static final String CONNECTION_QUEUE = "connection.queue";
    public static final String CONNECTION_KEY = "connection.accepted";

    // EXCHANGE 
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    // PROFILE QUEUE 
    @Bean
    public Queue profileQueue() {
        return new Queue(PROFILE_QUEUE, true);
    }

    @Bean
    public Binding profileBinding() {
        return BindingBuilder.bind(profileQueue())
                .to(exchange())
                .with(PROFILE_KEY);
    }

    // JOB QUEUE 
    @Bean
    public Queue jobQueue() {
        return new Queue(JOB_QUEUE, true);
    }

    @Bean
    public Binding jobBinding() {
        return BindingBuilder.bind(jobQueue())
                .to(exchange())
                .with(JOB_KEY);
    }

    // CONNECTION QUEUE 
    @Bean
    public Queue connectionQueue() {
        return new Queue(CONNECTION_QUEUE, true);
    }

    @Bean
    public Binding connectionBinding() {
        return BindingBuilder.bind(connectionQueue())
                .to(exchange())
                .with(CONNECTION_KEY);
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