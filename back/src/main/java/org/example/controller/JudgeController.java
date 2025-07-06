package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.dto.EventDto;
import org.example.dto.ResultInputDto;
import org.example.entity.Role;
import org.example.entity.User;
import org.example.service.EventService;
import org.example.service.JwtService;
import org.example.service.JudgeService;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/judge")
@RequiredArgsConstructor
public class JudgeController {

    private final JudgeService judgeService;
    private final EventService eventService;
    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping("/my-events")
    public ResponseEntity<List<EventDto>> getEventsForJudge(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ","");
        Long judgeId = jwtService.extractUserId(token);
        User user = userService.findById(judgeId).orElseThrow(()-> new RuntimeException("Пользователь не найден"));

        if (user.getRole() != Role.JUDGE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только судьи могут смотреть эту страницу");
        }

        List<EventDto> events = eventService.getEventsForJudge(judgeId);
        return ResponseEntity.ok(events);
    }


    @PostMapping("/{eventId}/submit-result")
    public ResponseEntity<Void> submitResult(
            @PathVariable Long eventId,
            @RequestBody ResultInputDto dto,
            HttpServletRequest request) {

        String token = request.getHeader("Authorization").replace("Bearer ","");
        Long judgeId = jwtService.extractUserId(token);
        User user = userService.findById(judgeId).orElseThrow(()-> new RuntimeException("Пользователь не найден"));

        if (user.getRole() != Role.JUDGE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only judges can submit results");
        }

        eventService.submitResult(judgeId, eventId, dto);
        return ResponseEntity.ok().build();
    }
}

