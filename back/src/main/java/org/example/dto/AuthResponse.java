package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
}
