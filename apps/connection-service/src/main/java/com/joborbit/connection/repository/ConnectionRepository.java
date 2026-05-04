package com.joborbit.connection.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joborbit.connection.entity.Connection;
import com.joborbit.connection.entity.Status;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Get all accepted connections
    List<Connection> findByUserIdAndStatus(Long userId, Status status);

    // Check connection (both directions)
    Optional<Connection> findByUserIdAndConnectionId(Long userId, Long connectionId);
    
    List<Connection> findByConnectionIdAndStatus(Long connectionId, Status status);

    Optional<Connection> findByConnectionIdAndUserId(Long userId, Long connectionId);
}