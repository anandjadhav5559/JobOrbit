package com.joborbit.feed.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // From Gateway
    private Long userId;

    @Column(length = 5000)
    private String content;

    // MEDIA 
    private String mediaUrl;     // Cloudinary URL

    @Column(name = "media_public_id") // IMPORTANT
    private String mediaPublicId; // Cloudinary public_id (for delete)

    private String mediaType;    // IMAGE / VIDEO

    // METRICS 
    private int likeCount;
    private int commentCount;

    private Long originalPostId;

    // TIMESTAMPS 
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // RELATION 
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}