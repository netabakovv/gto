package org.example.repository;

import org.example.entity.AgeGroup;
import org.example.entity.BadgeLevel;
import org.example.entity.Certificate;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    @Query("SELECT c FROM Certificate c WHERE c.user.id = :userId ORDER BY c.issuedAt DESC")
    List<Certificate> findAllByUserId(@Param("userId") Long userId);

    // Последний активный сертификат пользователя
    @Query("SELECT c FROM Certificate c WHERE c.user.id = :userId " +
            "ORDER BY c.badgeLevel DESC, c.issuedAt DESC LIMIT 1")
    Certificate findLatestByUserId(@Param("userId") Long userId);

}
