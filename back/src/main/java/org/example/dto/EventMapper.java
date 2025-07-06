package org.example.dto;

import org.example.entity.Event;
import org.example.repository.NormativeRepository;

import java.time.LocalDateTime;

public class EventMapper {
    public static EventDto toDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .status(event.getStatus())
                .registrationEnd(event.getRegistrationEnd())
                .registeredCount(event.getRegisteredCount())
                .eventNormatives(event.getEventNormatives())
                .registrationOpen(event.getRegistrationEnd().isAfter(LocalDateTime.now()))
                .build();
    }
}
