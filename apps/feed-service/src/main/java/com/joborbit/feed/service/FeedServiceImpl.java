package com.joborbit.feed.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.joborbit.feed.client.ConnectionClient;
import com.joborbit.feed.dto.CommentDTO;
import com.joborbit.feed.dto.PageResponseDTO;
import com.joborbit.feed.dto.PostResponseDTO;
import com.joborbit.feed.entity.*;
import com.joborbit.feed.exception.*;
import com.joborbit.feed.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final ConnectionClient connectionClient;

    // CREATE POST 
    @Override
    @Transactional
    @CacheEvict(value = "feed", allEntries = true)
    public PostResponseDTO createPost(Long userId, String content, MultipartFile file) {

        if ((content == null || content.isBlank()) && (file == null || file.isEmpty())) {
            throw new BadRequestException("Post cannot be empty");
        }

        String mediaUrl = null;
        String mediaType = null;
        String publicId = null;

        if (file != null && !file.isEmpty()) {

            Map<String, String> uploadResult =
                    cloudinaryStorageService.uploadFile(file, "posts");

            mediaUrl = uploadResult.get("url");
            publicId = uploadResult.get("publicId");

            if (file.getContentType() != null && file.getContentType().startsWith("image")) {
                mediaType = "IMAGE";
            } else if (file.getContentType() != null && file.getContentType().startsWith("video")) {
                mediaType = "VIDEO";
            }
        }

        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .mediaUrl(mediaUrl)
                .mediaPublicId(publicId) 
                .mediaType(mediaType)
                .likeCount(0)
                .commentCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Post saved = postRepository.save(post);

        return mapToDTO(saved);
    }

    // GET FEED 
    @Override
    @Cacheable(value = "feed", key = "#userId + '_' + #page + '_' + #size")
    public PageResponseDTO<PostResponseDTO> getFeed(Long userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        List<Long> connections = connectionClient.getConnections(userId, "true");

        if (connections == null || connections.isEmpty()) {
            Page<Post> posts = postRepository.findAll(pageable);
            return buildPageResponse(posts);
        }

        List<Long> userIds = new ArrayList<>(connections);
        userIds.add(userId);

        Page<Post> posts = postRepository.findByUserIdIn(userIds, pageable);

        return buildPageResponse(posts);
    }

    // SEARCH 
    @Override
    public PageResponseDTO<PostResponseDTO> searchPosts(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> posts = postRepository.searchPosts(keyword, pageable);

        return buildPageResponse(posts);
    }

    // LIKE / UNLIKE 
    @Override
    @Transactional
    @CacheEvict(value = "feed", allEntries = true)
    public String toggleLike(Long postId, Long userId) {

        Optional<PostLike> existing =
                postLikeRepository.findByPostIdAndUserId(postId, userId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.save(post);
            return "Unliked";
        } else {
            PostLike like = PostLike.builder()
                    .postId(postId)
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();

            postLikeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);

            return "Liked";
        }
    }

    // COMMENT 
    @Override
    @Transactional
    @CacheEvict(value = "feed", allEntries = true)
    public CommentDTO addComment(Long postId, Long userId, String content) {

        if (content == null || content.isBlank()) {
            throw new BadRequestException("Comment cannot be empty");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .post(post)
                .userId(userId)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        Comment saved = commentRepository.save(comment);

        return CommentDTO.builder()
                .id(saved.getId())
                .userId(saved.getUserId())
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    // DELETE POST 
    @Override
    @Transactional
    @CacheEvict(value = "feed", allEntries = true)
    public void deletePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized");
        }

        // Deleting from Cloudinary using publicId
        if (post.getMediaPublicId() != null && !post.getMediaPublicId().isBlank()) {
            cloudinaryStorageService.deleteFile(post.getMediaPublicId());
        }

        postRepository.delete(post);
    }

    // SHARE 
    @Override
    @Transactional
    public PostResponseDTO sharePost(Long postId, Long userId) {

        Post original = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Post shared = Post.builder()
                .userId(userId)
                .content(original.getContent())
                .mediaUrl(original.getMediaUrl())
                .mediaPublicId(original.getMediaPublicId()) 
                .mediaType(original.getMediaType())
                .originalPostId(original.getId())
                .likeCount(0)
                .commentCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Post saved = postRepository.save(shared);

        return mapToDTO(saved);
    }

    // SAVE / UNSAVE 
    @Override
    public String toggleSave(Long postId, Long userId) {

        Optional<SavedPost> existing =
                savedPostRepository.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            savedPostRepository.delete(existing.get());
            return "Post unsaved";
        } else {
            SavedPost saved = SavedPost.builder()
                    .postId(postId)
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();

            savedPostRepository.save(saved);
            return "Post saved";
        }
    }

    // GET SAVED POSTS 
    @Override
    public PageResponseDTO<PostResponseDTO> getSavedPosts(Long userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        List<Long> postIds = savedPostRepository.findByUserId(userId)
                .stream()
                .map(SavedPost::getPostId)
                .toList();

        if (postIds.isEmpty()) {
            return PageResponseDTO.<PostResponseDTO>builder()
                    .content(List.of())
                    .page(page)
                    .size(size)
                    .totalElements(0)
                    .totalPages(0)
                    .last(true)
                    .build();
        }

        Page<Post> posts = postRepository.findByIdIn(postIds, pageable);

        return buildPageResponse(posts);
    }

    //  HELPER 
    private PageResponseDTO<PostResponseDTO> buildPageResponse(Page<Post> posts) {

        return PageResponseDTO.<PostResponseDTO>builder()
                .content(posts.getContent().stream()
                        .map(this::mapToDTO)
                        .toList())
                .page(posts.getNumber())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .last(posts.isLast())
                .build();
    }

    // DTO MAPPER 
    private PostResponseDTO mapToDTO(Post post) {

        List<CommentDTO> comments = commentRepository
                .findTop3ByPost_IdOrderByCreatedAtDesc(post.getId())
                .stream()
                .map(c -> CommentDTO.builder()
                        .id(c.getId())
                        .userId(c.getUserId())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .toList();

        return PostResponseDTO.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .originalPostId(post.getOriginalPostId())
                .createdAt(post.getCreatedAt())
                .comments(comments)
                .build();
    }
}