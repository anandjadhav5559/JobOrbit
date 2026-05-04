package com.joborbit.connection.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionEvent {
    private Long userId1; 
    private Long userId2; 
}