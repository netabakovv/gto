package org.example.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.example.entity.User;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {


    private static final String SECRET_KEY = "my-super-secret-key-that-is-very-long-and-safe";
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 1 день
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token); // просто пробуем распарсить
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public Long extractUserId(String token) {
        Claims claims = parseToken(token).getBody();
        return Long.parseLong(claims.get("userId").toString());
    }

    public String extractRole(String token) {
        Claims claims = parseToken(token).getBody();
        return claims.get("role").toString();
    }

    public String extractEmail(String token) {
        return parseToken(token).getBody().getSubject();
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
