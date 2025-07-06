package org.example.repository;


import org.example.entity.Event;
import org.example.entity.EventStatus;
import org.example.entity.Normative;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Поиск по статусу
    List<Event> findByStatus(EventStatus status);

    List<Normative> findNormativeById(Long eventId);
    // Предстоящие события
    @Query("SELECT e FROM Event e WHERE e.status = 'UPCOMING' AND e.eventDate > :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);

    @Query("SELECT u FROM User u JOIN Registration r ON u.id = r.user.id WHERE r.event.id = :eventId")
    List<User> findUsersByEventId(@Param("eventId") Long eventId);

    // События судьи
    List<Event> findAllByJudges_Id(Long judgeId);
}
