package com.example.demo.user.service;

import com.example.demo.user.dto.BlogPostDTO;
import com.example.demo.user.entity.BlogPost;
import com.example.demo.user.repository.BlogPostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class BlogPostService {
    private static final Logger logger = LoggerFactory.getLogger(BlogPostService.class);
    private final BlogPostRepository blogPostRepository;

    public BlogPostService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public BlogPost createPost(BlogPostDTO postDTO, String authorEmail, String authorUsername) {
        try {
            logger.info("Creating post with title: {}", postDTO.getTitle());
            logger.info("Author email from parameter: {}", authorEmail);
            logger.info("Author username from parameter: {}", authorUsername);

            BlogPost blogPost = new BlogPost();
            blogPost.setTitle(postDTO.getTitle());
            blogPost.setContent(postDTO.getContent());
            blogPost.setAuthorEmail(authorEmail);
            blogPost.setAuthorUsername(authorUsername); // This should be the actual username
            blogPost.setCreatedAt(LocalDateTime.now());

            BlogPost savedPost = blogPostRepository.save(blogPost);
            logger.info("Post created successfully. ID: {}, AuthorEmail: {}, AuthorUsername: {}",
                    savedPost.getId(), savedPost.getAuthorEmail(), savedPost.getAuthorUsername());
            return savedPost;
        } catch (Exception e) {
            logger.error("Error saving post: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating post");
        }
    }

    public Page<BlogPost> getAllPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable);
    }

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public List<BlogPost> getPostsByAuthorEmail(String email) {
        return blogPostRepository.findByAuthorEmail(email);
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public BlogPost updatePost(Long id, BlogPostDTO postDTO, String authorEmail) {
        return blogPostRepository.findById(id)
                .map(post -> {
                    if (!post.getAuthorEmail().equals(authorEmail)) {
                        throw new RuntimeException("Unauthorized to edit this post");
                    }
                    post.setTitle(postDTO.getTitle());
                    post.setContent(postDTO.getContent());
                    return blogPostRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }


    @Transactional
    public void deletePost(Long id, String authorEmail) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthorEmail().equals(authorEmail)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        blogPostRepository.delete(post);
    }

    public List<BlogPost> getPostsByAuthor(String authorEmail) {
        return blogPostRepository.findByAuthorEmail(authorEmail);
    }



}
