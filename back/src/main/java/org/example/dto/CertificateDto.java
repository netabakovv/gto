package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.AgeGroup;
import org.example.entity.BadgeLevel;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificateDto {
    private String certificateNumber;
    private BadgeLevel badgeLevel;
    private AgeGroup ageGroup;
    private Integer year;
    private LocalDateTime issuedAt;
}
