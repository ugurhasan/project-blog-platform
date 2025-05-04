package com.example.demo.user.controller;

import com.example.demo.user.dto.CommentDTO;
import com.example.demo.user.entity.Comment;
import com.example.demo.user.service.CommentService;
import com.example.demo.user.service.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * REST Controller for handling comment-related operations.
 * Provides endpoints for creating, retrieving, and deleting comments.
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    // Service layer for comment operations
    private final CommentService commentService;

    // Utility for JWT token operations
    private final JwtUtil jwtUtil;

    /**
     * Constructor for dependency injection
     * @param commentService Service layer for comment operations
     * @param jwtUtil Utility for JWT token operations
     */
    public CommentController(CommentService commentService, JwtUtil jwtUtil) {
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Creates a new comment
     * @param commentDTO DTO containing comment data
     * @param request HTTP request containing authorization token
     * @return ResponseEntity with created comment or error message
     */
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentDTO commentDTO, HttpServletRequest request) {
        try {
            // Extract user information from JWT token
            String email = extractEmailFromToken(request);
            String username = extractUsernameFromToken(request);

            // Create and return the new comment
            Comment createdComment = commentService.createComment(commentDTO, email, username);
            return ResponseEntity.ok(createdComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating comment: " + e.getMessage());
        }
    }

    /**
     * Retrieves all comments for a specific post
     * @param postId ID of the post to get comments for
     * @return ResponseEntity with list of comments
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Retrieves all comments made by the current authenticated user
     * @param request HTTP request containing authorization token
     * @return ResponseEntity with user's comments or error message
     */
    @GetMapping("/my-comments")
    public ResponseEntity<?> getUserComments(HttpServletRequest request) {
        try {
            // Extract user email from JWT token
            String email = extractEmailFromToken(request);

            // Get and return user's comments
            List<Comment> userComments = commentService.getCommentsByUser(email);
            return ResponseEntity.ok(userComments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }

    /**
     * Deletes a comment if the current user is the author
     * @param commentId ID of the comment to delete
     * @param request HTTP request containing authorization token
     * @return ResponseEntity with no content or error message
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, HttpServletRequest request) {
        try {
            // Extract user email from JWT token
            String email = extractEmailFromToken(request);

            // Delete the comment (service layer verifies ownership)
            commentService.deleteComment(commentId, email);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    /**
     * Extracts email from the JWT token in the Authorization header
     * @param request HTTP request containing the Authorization header
     * @return Extracted email from the token
     * @throws RuntimeException if token is missing or invalid
     */
    private String extractEmailFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization token");
        }
        return jwtUtil.extractEmail(token.substring(7));
    }

    /**
     * Extracts username from the JWT token in the Authorization header
     * @param request HTTP request containing the Authorization header
     * @return Extracted username from the token
     * @throws RuntimeException if token is missing or invalid
     */
    private String extractUsernameFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization token");
        }
        return jwtUtil.extractUsername(token.substring(7));
    }
}