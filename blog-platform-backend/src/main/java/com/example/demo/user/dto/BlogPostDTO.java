package com.example.demo.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostDTO {
    private String title;
    private String content;
    private String authorEmail;
    private String authorUsername;
    private LocalDateTime createdAt;
}