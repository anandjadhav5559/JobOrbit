package com.joborbit.feed.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostResponseDTO {

    private Long id;
    private Long userId;
    private String content;

    private String mediaUrl;
    private String mediaType;

    private int likeCount;
    private int commentCount;

    private Long originalPostId;

    private LocalDateTime createdAt;

    private List<CommentDTO> comments;
}
