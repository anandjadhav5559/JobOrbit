package com.joborbit.feed.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joborbit.feed.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // fetch latest 3 comments (used in feed)
    List<Comment> findTop3ByPost_IdOrderByCreatedAtDesc(Long postId);

    // Optional: fetch all comments (for comment page)
    List<Comment> findByPost_IdOrderByCreatedAtDesc(Long postId);

    // Count comments 
    long countByPost_Id(Long postId);
}