package com.joborbit.feed.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.joborbit.feed.entity.SavedPost;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    Optional<SavedPost> findByPostIdAndUserId(Long postId, Long userId);

    List<SavedPost> findByUserId(Long userId);
    
    
}