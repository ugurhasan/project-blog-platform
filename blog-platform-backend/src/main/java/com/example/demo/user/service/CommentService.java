package com.example.demo.user.service;

import com.example.demo.user.dto.CommentDTO;
import com.example.demo.user.entity.BlogPost;
import com.example.demo.user.entity.Comment;
import com.example.demo.user.repository.BlogPostRepository;
import com.example.demo.user.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final BlogPostRepository blogPostRepository;

    public CommentService(CommentRepository commentRepository, BlogPostRepository blogPostRepository) {
        this.commentRepository = commentRepository;
        this.blogPostRepository = blogPostRepository;
    }

    @Transactional
    public Comment createComment(CommentDTO commentDTO, String authorEmail, String authorUsername) {
        BlogPost post = blogPostRepository.findById(commentDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setPost(post);
        comment.setAuthorEmail(authorEmail);
        comment.setAuthorUsername(authorUsername);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getCommentsByUser(String authorEmail) {
        return commentRepository.findByAuthorEmail(authorEmail);
    }

    @Transactional
    public void deleteComment(Long commentId, String authorEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthorEmail().equals(authorEmail)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}