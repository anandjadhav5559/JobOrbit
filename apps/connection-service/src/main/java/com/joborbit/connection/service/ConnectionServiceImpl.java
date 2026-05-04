package com.joborbit.connection.service;

import com.joborbit.connection.entity.Connection;
import com.joborbit.connection.entity.Status;
import com.joborbit.connection.repository.ConnectionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService {

    private final ConnectionRepository repository;

    // SEND REQUEST 
    @Override
    public void sendRequest(Long senderId, Long receiverId) {

        // Prevent self connection
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("You cannot connect with yourself");
        }

        // Check if connection already exists (both directions)
        boolean exists = repository.findByUserIdAndConnectionId(senderId, receiverId).isPresent()
                || repository.findByUserIdAndConnectionId(receiverId, senderId).isPresent();

        if (exists) {
            throw new RuntimeException("Connection already exists or pending");
        }

        // Create request
        Connection connection = Connection.builder()
                .userId(senderId)
                .connectionId(receiverId)
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(connection);
    }

    // ACCEPT REQUEST 
    @Override
    public void acceptRequest(Long senderId, Long receiverId) {

        Connection connection = repository
                .findByUserIdAndConnectionId(senderId, receiverId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Already accepted
        if (connection.getStatus() == Status.ACCEPTED) {
            throw new RuntimeException("Already connected");
        }

        connection.setStatus(Status.ACCEPTED);
        repository.save(connection);
    }

    // REJECT REQUEST 
    @Override
    public void rejectRequest(Long senderId, Long receiverId) {

        Connection connection = repository
                .findByUserIdAndConnectionId(senderId, receiverId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        connection.setStatus(Status.REJECTED);
        repository.save(connection);
    }

    // GET CONNECTIONS 
    @Override
    public List<Long> getConnections(Long userId) {

        // Sent connections
        List<Long> sent = repository
                .findByUserIdAndStatus(userId, Status.ACCEPTED)
                .stream()
                .map(Connection::getConnectionId)
                .toList();

        // Received connections
        List<Long> received = repository
                .findByConnectionIdAndStatus(userId, Status.ACCEPTED)
                .stream()
                .map(Connection::getUserId)
                .toList();

        // Merge both sides
        return Stream.concat(sent.stream(), received.stream())
                .distinct()
                .toList();
    }

    //  CHECK CONNECTION 
    @Override
    public boolean checkConnection(Long user1, Long user2) {

        return repository.findByUserIdAndConnectionId(user1, user2)
                .filter(c -> c.getStatus() == Status.ACCEPTED)
                .isPresent()
            ||
               repository.findByUserIdAndConnectionId(user2, user1)
                .filter(c -> c.getStatus() == Status.ACCEPTED)
                .isPresent();
    }
}