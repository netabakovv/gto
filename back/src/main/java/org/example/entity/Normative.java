package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "normatives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Normative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NormativeType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "age_group")
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @OneToMany(mappedBy = "normative", fetch = FetchType.LAZY)
    private List<EventNormative> eventNormatives;

    @Column(nullable = false)
    private String unit; // секунды, метры, количество, очки

    // Нормы для значков (меньше = лучше для времени, больше = лучше для дистанции/количества)
    @Column(precision = 10, scale = 2, name = "bronze_standard")
    private BigDecimal bronzeStandard;

    @Column(precision = 10, scale = 2, name = "silver_standard")
    private BigDecimal silverStandard;

    @Column(precision = 10, scale = 2, name = "gold_standard")
    private BigDecimal goldStandard;

    // Тип измерения (чем меньше - тем лучше для времени, чем больше - тем лучше для расстояния)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "measurement_type")
    private MeasurementType measurementType;

    // Связи
    @OneToMany(mappedBy = "normative", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Result> results;

    @Transient
    public BadgeLevel getBadgeLevel(BigDecimal result) {
        if (result == null) return null;

        if (measurementType == MeasurementType.LESS_IS_BETTER) {
            // Для времени: меньше = лучше
            if (result.compareTo(goldStandard) <= 0) return BadgeLevel.GOLD;
            if (result.compareTo(silverStandard) <= 0) return BadgeLevel.SILVER;
            if (result.compareTo(bronzeStandard) <= 0) return BadgeLevel.BRONZE;
        } else {
            // Для расстояния/количества: больше = лучше
            if (result.compareTo(goldStandard) >= 0) return BadgeLevel.GOLD;
            if (result.compareTo(silverStandard) >= 0) return BadgeLevel.SILVER;
            if (result.compareTo(bronzeStandard) >= 0) return BadgeLevel.BRONZE;
        }

        return null; // Не сдал
    }
}