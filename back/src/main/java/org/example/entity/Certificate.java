package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String certificateNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeLevel badgeLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeGroup ageGroup;

    @Column(nullable = false)
    private Integer year;

    @CreationTimestamp
    private LocalDateTime issuedAt;

    @PrePersist
    private void generateCertificateNumber() {
        if (certificateNumber == null) {
            certificateNumber = String.format("ГТО-%04d-%07d",
                    year != null ? year : LocalDateTime.now().getYear(),
                    id != null ? id : System.currentTimeMillis() % 10000000);
        }
    }
}
