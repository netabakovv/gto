package org.example.repository;

import org.example.entity.Gender;
import org.example.entity.Role;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Базовые запросы
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Поиск судей
    @Query("SELECT u FROM User u WHERE u.role = 'JUDGE'")
    List<User> findJudges();

    @Modifying
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :userId")
    void updateUserRole(@Param("userId") Long userId, @Param("role") Role role);

}
