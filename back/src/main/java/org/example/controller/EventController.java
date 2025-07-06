package org.example.controller;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.example.dto.EventDto;
import org.example.dto.EventMapper;
import org.example.dto.NormativeDto;
import org.example.dto.UserProfileDto;
import org.example.entity.Event;
import org.example.service.EventService;
import org.example.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAll());
    }

    @PostMapping
    public ResponseEntity<Event> create(@RequestHeader("Authorization") String auth,
                                        @RequestBody Event event) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(eventService.create(event, jwtService.extractUserId(token)));
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<UserProfileDto>> getEventParticipants(
            @PathVariable("eventId") Long eventId) {
        List<UserProfileDto> participants = eventService.getUsersByEventId(eventId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{eventId}/judges")
    public ResponseEntity<List<UserProfileDto>> getEventJudges(
            @PathVariable("eventId") Long eventId) {
        List<UserProfileDto> judges = eventService.getJudgesByEventId(eventId);
        return ResponseEntity.ok(judges != null ? judges : Collections.emptyList());
    }

    // Назначить судей на событие
    @PostMapping("/{eventId}/judges")
    public ResponseEntity<?> assignJudgesToEvent(
            @RequestHeader("Authorization") String auth,
            @PathVariable("eventId") Long eventId,
            @RequestBody List<Long> judgeIds) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        eventService.assignJudgesToEvent(eventId, judgeIds);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> registerForEvent(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("eventId") Long eventId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            eventService.registerUserForEvent(eventId, token);
            return ResponseEntity.ok().build();

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Недействительный токен");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<EventDto> update(@RequestHeader("Authorization") String auth,
                                               @PathVariable("id") Long id,
                                               @RequestBody EventDto dto) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("Authorization") String auth,
                                       @PathVariable("id") Long id) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/future")
    public ResponseEntity<List<Event>> getUpcoming() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
}

