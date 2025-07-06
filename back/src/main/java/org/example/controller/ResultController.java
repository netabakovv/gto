package org.example.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.dto.ResultDto;
import org.example.dto.ResultMapper;
import org.example.dto.ResultRequest;
import org.example.entity.Result;
import org.example.entity.Role;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.service.JwtService;
import org.example.service.ResultService;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final UserService userService;
    private final ResultService resultService;
    private final JwtService jwtService;

    @GetMapping("/normative/{normativeId}")
    public ResponseEntity<List<ResultDto>> getResultsByNormativeId(
            @PathVariable("normativeId") Long normativeId) {
        List<ResultDto> results = resultService.getResultsByNormativeId(normativeId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/user/{userId}/{year}")
    public ResponseEntity<List<ResultDto>> getResultsForUser(
            @PathVariable("userId") Long userId,
            @PathVariable("year") int year,  // Исправлено: было @PathVariable("userId")
            @RequestHeader("Authorization") String token) {

        String email = jwtService.extractEmail(token.replace("Bearer ", ""));
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

        if (!user.getId().equals(userId) && !user.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                userService.getResultHistory(userId)  // Предполагается, что метод принимает год
                        .stream()
                        .map(ResultMapper::toDto)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<ResultDto> createResult(@RequestBody ResultRequest request) {
        Result result = resultService.createOrUpdateResult(request);
        return ResponseEntity.ok(ResultMapper.toDto(result));  // Возвращаем DTO вместо Entity
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ResultDto>> createResults(@RequestBody List<ResultRequest> requests) {
        List<ResultDto> results = resultService.createMultipleResults(requests)
                .stream()
                .map(ResultMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<List<ResultDto>> getResults(
            @PathVariable("userId") Long userId,
            @PathVariable("eventId") Long eventId) {

        List<ResultDto> results = resultService.getResultsByUserAndEvent(userId, eventId)
                .stream()
                .map(ResultMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}