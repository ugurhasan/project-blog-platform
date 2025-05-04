package com.example.demo.user.controller;

import com.example.demo.user.dto.BlogPostDTO;
import com.example.demo.user.entity.BlogPost;
import com.example.demo.user.service.BlogPostService;
import com.example.demo.user.service.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Controller for handling blog post-related operations.
 * Provides endpoints for creating, retrieving, updating, and deleting blog posts.
 */
@RestController
@RequestMapping("/api/posts")
public class BlogPostController {

    private static final Logger logger = LoggerFactory.getLogger(BlogPostController.class);
    private final BlogPostService blogPostService;
    private final JwtUtil jwtUtil;

    /**
     * Constructor for injecting dependencies.
     */
    public BlogPostController(BlogPostService blogPostService, JwtUtil jwtUtil) {
        this.blogPostService = blogPostService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Creates a new blog post.
     * @param postDTO Data Transfer Object containing post details.
     * @param request HTTP request to extract user details from JWT.
     * @return ResponseEntity with created blog post or error message.
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody BlogPostDTO postDTO, HttpServletRequest request) {
        try {
            String email = extractEmailFromToken(request);
            String username = extractUsernameFromToken(request);
            BlogPost createdPost = blogPostService.createPost(postDTO, email, username);
            return ResponseEntity.ok(createdPost);
        } catch (Exception e) {
            logger.error("Error creating post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    /**
     * Retrieves all blog posts with pagination.
     * @param page Page number (default: 0).
     * @param size Number of posts per page (default: 5).
     * @return ResponseEntity containing a paginated list of blog posts.
     */
    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> postsPage = blogPostService.getAllPosts(pageable);
        return ResponseEntity.ok(postsPage);
    }

    /**
     * Retrieves all posts created by the logged-in user.
     * @param request HTTP request to extract user email from JWT.
     * @return ResponseEntity containing the list of user-created posts.
     */
    @GetMapping("/my-posts")
    public ResponseEntity<?> getUserPosts(HttpServletRequest request) {
        try {
            String email = extractEmailFromToken(request);
            List<BlogPost> userPosts = blogPostService.getPostsByAuthor(email);
            return ResponseEntity.ok(userPosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
        }
    }

    /**
     * Retrieves a blog post by its ID.
     * @param id The ID of the blog post.
     * @return ResponseEntity containing the requested blog post.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        BlogPost post = blogPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    /**
     * Updates an existing blog post.
     * @param id The ID of the post to update.
     * @param postDTO The updated post data.
     * @param request HTTP request to extract user email from JWT.
     * @return ResponseEntity containing the updated blog post or an error message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody BlogPostDTO postDTO, HttpServletRequest request) {
        try {
            String email = extractEmailFromToken(request);
            BlogPost updatedPost = blogPostService.updatePost(id, postDTO, email);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Deletes a blog post.
     * @param id The ID of the post to delete.
     * @param request HTTP request to extract user email from JWT.
     * @return ResponseEntity with no content if successful or an error message.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, HttpServletRequest request) {
        try {
            String email = extractEmailFromToken(request);
            blogPostService.deletePost(id, email);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Extracts the email from the JWT token in the request header.
     * @param request HTTP request containing the Authorization header.
     * @return Extracted email from the token.
     */
    private String extractEmailFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Missing Authorization token");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String email = jwtUtil.extractEmail(token);
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Invalid token: Email not found");
        }
        return email;
    }

    /**
     * Extracts the username from the JWT token in the request header.
     * @param request HTTP request containing the Authorization header.
     * @return Extracted username from the token.
     */
    private String extractUsernameFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Missing Authorization token");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String username = jwtUtil.extractUsername(token);
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Invalid token: Username not found");
        }

        logger.info("Extracted username from token: {}", username);
        return username;
    }
}
