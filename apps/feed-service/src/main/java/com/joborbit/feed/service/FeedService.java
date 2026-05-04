package com.joborbit.feed.service;

import org.springframework.web.multipart.MultipartFile;

import com.joborbit.feed.dto.CommentDTO;
import com.joborbit.feed.dto.PageResponseDTO;
import com.joborbit.feed.dto.PostResponseDTO;

public interface FeedService {

    // CREATE POST
    PostResponseDTO createPost(Long userId, String content, MultipartFile file);

    // GET FEED
    PageResponseDTO<PostResponseDTO> getFeed(Long userId, int page, int size);

    // SEARCH
    PageResponseDTO<PostResponseDTO> searchPosts(String keyword, int page, int size);

    // LIKE / UNLIKE
    String toggleLike(Long postId, Long userId);

    // COMMENT
    CommentDTO addComment(Long postId, Long userId, String content);

    // DELETE POST
    void deletePost(Long postId, Long userId);

    // SHARE
    PostResponseDTO sharePost(Long postId, Long userId);

    // SAVE / UNSAVE
    String toggleSave(Long postId, Long userId);

    // SAVED POSTS
    PageResponseDTO<PostResponseDTO> getSavedPosts(Long userId, int page, int size);
}