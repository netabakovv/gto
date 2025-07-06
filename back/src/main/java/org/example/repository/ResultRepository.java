package org.example.repository;

import org.example.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    boolean existsByUserIdAndEventIdAndNormativeId(Long userId, Long eventId, Long normativeId);

    @Query("SELECT r FROM Result r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Result> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Result r WHERE r.event.id = :eventId ORDER BY r.createdAt DESC")
    List<Result> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM Result r WHERE r.event.id = :eventId ORDER BY r.createdAt DESC")
    List<Result> findByNormativeId(@Param("eventId") Long eventId);

    // Результаты за период
    @Query("SELECT DISTINCT YEAR(r.createdAt) FROM Result r WHERE r.user.id = :userId ORDER BY YEAR(r.createdAt) DESC")
    List<Integer> findDistinctYearsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Result r WHERE r.user.id = :userId AND r.passed = true")
    long countPassedResultsByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Result r WHERE r.user.id = :userId AND r.event.id = :eventId")
    List<Result> findByUserIdAndEventId(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId);

    @Query("SELECT r FROM Result r WHERE r.user.id = :userId AND r.event.id = :eventId AND r.normative.id = :normativeId")
    Optional<Result> findByUserIdAndEventIdAndNormativeId(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId,
            @Param("normativeId") Long normativeId);
}
