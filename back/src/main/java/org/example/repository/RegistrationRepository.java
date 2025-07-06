package org.example.repository;

import org.example.entity.Event;
import org.example.entity.Registration;
import org.example.entity.RegistrationStatus;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Поиск по пользователю
    List<Registration> findByUser(User user);

    List<Registration> findByUserAndStatus(User user, RegistrationStatus status);

    @Query("SELECT r FROM Registration r WHERE r.user.id = :userId")
    List<Registration> findByUserId(@Param("userId") Long userId);

    // Поиск по событию
    List<Registration> findByEvent(Event event);

    @Query("SELECT r FROM Registration r WHERE r.event.id = :eventId AND r.status = 'ACTIVE'")
    List<Registration> findActiveRegistrationsByEventId(@Param("eventId") Long eventId);

    // Статистика регистраций
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.status = :status")
    long countByStatus(@Param("status") RegistrationStatus status);

    boolean existsByUserAndEvent(User user, Event event);

    @Query("SELECT r FROM Registration r WHERE r.event.id = :eventId")
    List<User> findUsersByEventId(Long eventId);
}
