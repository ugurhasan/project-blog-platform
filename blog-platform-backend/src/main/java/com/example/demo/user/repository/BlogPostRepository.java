package com.example.demo.user.repository;

import com.example.demo.user.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long>, PagingAndSortingRepository<BlogPost, Long> {
    List<BlogPost> findByAuthorEmail(String authorEmail);
    List<BlogPost> findByAuthorUsername(String authorUsername);
    List<BlogPost> findByCreatedAtAfter(LocalDateTime date);
}