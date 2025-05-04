package com.example.demo.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private String content;
    private Long postId;
    private String authorEmail;
    private String authorUsername;
    private LocalDateTime createdAt;
}