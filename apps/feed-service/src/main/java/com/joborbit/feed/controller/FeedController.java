package com.joborbit.feed.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.joborbit.feed.dto.CommentDTO;
import com.joborbit.feed.dto.CommentRequest;
import com.joborbit.feed.dto.PageResponseDTO;
import com.joborbit.feed.dto.PostResponseDTO;
import com.joborbit.feed.service.FeedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FeedController {

    private final FeedService feedService;

    // CREATE POST 
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDTO> createPost(
            @RequestParam(value = "content", required = false) String content, 
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.createPost(userId, content, file)
        );
    }

    // GET FEED 
    @GetMapping
    public ResponseEntity<PageResponseDTO<PostResponseDTO>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.getFeed(userId, page, size)
        );
    }

    // SEARCH 
    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<PostResponseDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                feedService.searchPosts(keyword, page, size)
        );
    }

    // LIKE / UNLIKE 
    @PostMapping("/{postId}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.toggleLike(postId, userId)
        );
    }

    // ================= SHARE =================
    @PostMapping("/{postId}/share")
    public ResponseEntity<PostResponseDTO> sharePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.sharePost(postId, userId)
        );
    }

    // SAVE / UNSAVE 
    @PostMapping("/{postId}/save")
    public ResponseEntity<String> toggleSave(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.toggleSave(postId, userId)
        );
    }

    // COMMENT 
    @PostMapping("/{postId}/comment")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest requestBody,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.addComment(postId, userId, requestBody.getContent())
        );
    }

    // DELETE POST 
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        feedService.deletePost(postId, userId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    // GET SAVED POSTS 
    @GetMapping("/saved")
    public ResponseEntity<PageResponseDTO<PostResponseDTO>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                feedService.getSavedPosts(userId, page, size)
        );
    }
}