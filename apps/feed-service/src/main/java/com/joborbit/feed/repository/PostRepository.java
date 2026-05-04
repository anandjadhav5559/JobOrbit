package com.joborbit.feed.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.joborbit.feed.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    // FEED
    Page<Post> findAll(Pageable pageable);

    // SEARCH 
    @Query("""
           SELECT p FROM Post p
           WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
           """)
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);

    // USER POSTS 
    Page<Post> findByUserId(Long userId, Pageable pageable);
    
    Page<Post> findByUserIdIn(List<Long> userIds, Pageable pageable);

    // SHARED POSTS 
    Page<Post> findByOriginalPostId(Long originalPostId, Pageable pageable);
    
    Page<Post> findByIdIn(List<Long> ids, Pageable pageable);

}