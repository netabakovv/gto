package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.UserMapper;
import org.example.dto.UserProfileDto;
import org.example.entity.User;
import org.example.repository.ResultRepository;
import org.example.repository.UserRepository;
import org.example.service.JwtService;
import org.example.service.ResultService;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    private final ResultService resultService;

    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile(@RequestHeader("Authorization") String token) {
        Long id = jwtService.extractUserId(token.substring(7));
        return ResponseEntity.ok(userService.getProfile(id));
    }

    @PutMapping
    public ResponseEntity<Void> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UserProfileDto profileDto) {
        String email = jwtService.extractEmail(token.substring(7));
        userService.updateProfile(email, profileDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAvailableYears(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractEmail(token.substring(7));
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Integer> years = resultService.getDistinctYearsByUserId(user.getId());
        return ResponseEntity.ok(years);
    }

    @GetMapping("/judges")
    public List<UserProfileDto> getJudges() {
        return userService.findJudges()
                .stream()
                .map(UserMapper::toDto)
                .toList();
    }
}

