package com.joborbit.feed.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentDTO {

    private Long id;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
}