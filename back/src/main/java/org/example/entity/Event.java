package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, name = "event_date")
    @Future
    private LocalDateTime eventDate;

    @Column(nullable = false)
    @NotBlank
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.UPCOMING;

    @Column(name = "registration_end")
    private LocalDateTime registrationEnd;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Связи
    @ManyToMany
    @JoinTable(
            name = "event_judges",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> judges;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Registration> registrations = new ArrayList<>();

    // Добавить связь с EventNormative
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventNormative> eventNormatives = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Result> results;

    @Transient
    public boolean isRegistrationOpen() {
        LocalDateTime now = LocalDateTime.now();
        return status == EventStatus.UPCOMING &&
                (registrationEnd == null || now.isBefore(registrationEnd));
    }

    @Transient
    public int getRegisteredCount() {
        return registrations != null ? registrations.size() : 0;
    }
}