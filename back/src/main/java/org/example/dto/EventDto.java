package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.EventNormative;
import org.example.entity.EventStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private EventStatus status;
    private LocalDateTime registrationEnd;
    private boolean registrationOpen;
    private int registeredCount;
    private List<EventNormative> eventNormatives;
}

