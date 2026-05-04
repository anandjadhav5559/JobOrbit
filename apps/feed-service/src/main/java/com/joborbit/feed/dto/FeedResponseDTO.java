package com.joborbit.feed.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedResponseDTO {

    private List<PostResponseDTO> posts;

    private int currentPage;
    private int totalPages;
    private long totalElements;
}