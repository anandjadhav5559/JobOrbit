package com.joborbit.connection.service;

import java.util.List;

public interface ConnectionService {

    void sendRequest(Long senderId, Long receiverId);

    void acceptRequest(Long senderId, Long receiverId);

    void rejectRequest(Long senderId, Long receiverId);

    List<Long> getConnections(Long userId);

    boolean checkConnection(Long user1, Long user2);
}